import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("Received upload request");

    const formData1 = await request.formData();
    const image = formData1.get("image") as File | null;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 },
      );
    }

    const formData = new FormData();
    formData.append("image", image, image.name);

    const response = await fetch("https://api.milele.health/validate-image", {
      method: "POST",
      headers: {
        accept: "application/json",
        "accept-language": "en-US,en;q=0.9",
      },
      body: formData,
    });
    const data = await response.json();
    console.log("Response from API:", data);

    return NextResponse.json({
      success: true,
      fileName: image.name,
      fileSize: image.size,
      fileType: image.type,
    });
  } catch (error) {
    console.error("Error handling upload:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to process upload",
      },
      { status: 500 },
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
    responseLimit: "10mb",
  },
};
