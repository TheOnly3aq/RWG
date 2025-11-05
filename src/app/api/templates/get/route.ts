import { NextRequest, NextResponse } from "next/server";
import { initDatabase, getUnseenTemplate } from "../../../../lib/db";

/**
 * GET handler for retrieving an unseen template
 * Checks cookies for seen template IDs and returns an unseen template
 * @param {NextRequest} request - The incoming request
 * @returns {Promise<NextResponse>} Template data or error
 */
export async function GET(request: NextRequest) {
  try {
    await initDatabase();

    // Get seen IDs from cookie
    const seenCookie = request.cookies.get("seen_templates");
    const seenIds: string[] = seenCookie ? JSON.parse(seenCookie.value) : [];

    // Get unseen template
    const template = await getUnseenTemplate(seenIds);

    if (!template) {
      return NextResponse.json(
        { template: null, message: "No unseen templates available" },
        { status: 200 }
      );
    }

    return NextResponse.json({ template });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to get template",
      },
      { status: 500 }
    );
  }
}

