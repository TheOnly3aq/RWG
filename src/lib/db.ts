import { Pool } from "pg";

/**
 * Database connection pool
 */
let pool: Pool | null = null;

/**
 * Get or create database connection pool
 * @returns {Pool} PostgreSQL connection pool
 */
function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    const sslMode = connectionString.match(/sslmode=([^&]+)/)?.[1];
    let sslConfig: boolean | { rejectUnauthorized: boolean } = false;

    if (
      sslMode === "require" ||
      sslMode === "prefer" ||
      sslMode === "verify-ca" ||
      sslMode === "verify-full"
    ) {
      sslConfig = {
        rejectUnauthorized:
          sslMode !== "verify-full" && sslMode !== "verify-ca",
      };
    } else if (process.env.DATABASE_SSL === "true") {
      sslConfig = { rejectUnauthorized: false };
    }

    pool = new Pool({
      connectionString,
      ssl: sslConfig,
    });
  }

  return pool;
}

/**
 * Initialize database table if it doesn't exist
 * Creates templates table with id (UUID), html (text), and created_at (timestamp)
 */
export async function initDatabase(): Promise<void> {
  const client = await getPool().connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS templates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        html TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_templates_created_at ON templates(created_at)
    `);
  } finally {
    client.release();
  }
}

/**
 * Get an unseen template for the user
 * @param {string[]} seenIds - Array of template IDs the user has already seen
 * @returns {Promise<{id: string, html: string} | null>} Template or null if none found
 */
export async function getUnseenTemplate(
  seenIds: string[]
): Promise<{ id: string; html: string } | null> {
  const client = await getPool().connect();
  try {
    let query = "SELECT id, html FROM templates";
    const params: unknown[] = [];

    if (seenIds.length > 0) {
      query += ` WHERE id NOT IN (${seenIds.map((_, i) => `$${i + 1}`).join(", ")})`;
      params.push(...seenIds);
    }

    query += " ORDER BY created_at DESC LIMIT 1";

    const result = await client.query(query, params.length > 0 ? params : undefined);

    if (result.rows.length === 0) {
      return null;
    }

    return {
      id: result.rows[0].id,
      html: result.rows[0].html,
    };
  } finally {
    client.release();
  }
}

/**
 * Save a new template to the database
 * @param {string} html - The HTML content to save
 * @returns {Promise<string>} The ID of the saved template
 */
export async function saveTemplate(html: string): Promise<string> {
  const client = await getPool().connect();
  try {
    const result = await client.query(
      "INSERT INTO templates (html) VALUES ($1) RETURNING id",
      [html]
    );
    await cleanupOldTemplates();

    return result.rows[0].id;
  } finally {
    client.release();
  }
}

/**
 * Clean up old templates to maintain max 300 templates
 * Deletes oldest templates first
 */
async function cleanupOldTemplates(): Promise<void> {
  const client = await getPool().connect();
  try {
    await client.query(`
      DELETE FROM templates
      WHERE id IN (
        SELECT id FROM templates
        ORDER BY created_at ASC
        OFFSET 300
      )
    `);
  } finally {
    client.release();
  }
}

/**
 * Close database connection pool
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

