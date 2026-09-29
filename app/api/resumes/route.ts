import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { Resume } = await connectToDatabase();

    const resume = await Resume.create(body);

    return NextResponse.json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("Save resume error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save resume",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { Resume } = await connectToDatabase();

    const resumes = await Resume.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      resumes,
    });
  } catch (error) {
    console.error("Get resumes error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load resumes",
      },
      { status: 500 }
    );
  }
}