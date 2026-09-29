import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid resume ID" },
        { status: 400 }
      );
    }

    const { Resume } = await connectToDatabase();
    const resume = await Resume.findById(id);

    if (!resume) {
      return NextResponse.json(
        { success: false, message: "Resume not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("Get resume error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load resume",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid resume ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const { Resume } = await connectToDatabase();

    const resume = await Resume.findByIdAndUpdate(
      id,
      {
        name: body.name,
        ownerId: body.ownerId ?? null,
        data: body.data,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!resume) {
      return NextResponse.json(
        { success: false, message: "Resume not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("Update resume error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update resume",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid resume ID" },
        { status: 400 }
      );
    }

    const { Resume } = await connectToDatabase();

    const resume = await Resume.findByIdAndDelete(id);

    if (!resume) {
      return NextResponse.json(
        { success: false, message: "Resume not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("Delete resume error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete resume",
      },
      { status: 500 }
    );
  }
}