// import { type NextRequest, NextResponse } from "next/server";

// export async function POST(request: NextRequest) {
//   try {
//     console.log("Received upload request");

//     const formData = await request.formData();
//     const image = formData.get("image") as File | null;

//     if (!image) {
//       return NextResponse.json({ error: "No image provided" }, { status: 400 });
//     }

//     if (!image.type.startsWith("image/")) {
//       return NextResponse.json(
//         { error: "File must be an image" },
//         { status: 400 },
//       );
//     }

//     // Convert File to Buffer to recreate it with metadata
//     const arrayBuffer = await image.arrayBuffer();
//     const fileWithMeta = new File([arrayBuffer], image.name, {
//       type: image.type,
//       lastModified: image.lastModified, // Preserve lastModified if available
//     });

//     console.log("fileWithMeta:", fileWithMeta);

//     const forwardFormData = new FormData();
//     forwardFormData.append("image", fileWithMeta);

//     const response = await fetch("https://api.milele.health/validate-image", {
//       method: "POST",
//       headers: {
//         accept: "application/json",
//         "accept-language": "en-US,en;q=0.9",
//         // Do not set Content-Type manually
//       },
//       body: forwardFormData,
//     });

//     const data = await response.json();
//     console.log("Response from API:", data);

//     return NextResponse.json({
//       success: true,
//       fileName: fileWithMeta.name,
//       fileSize: fileWithMeta.size,
//       fileType: fileWithMeta.type,
//       lastModified: fileWithMeta.lastModified,
//       apiResponse: data,
//     });
//   } catch (error) {
//     console.error("Error handling upload:", error);
//     return NextResponse.json(
//       {
//         error:
//           error instanceof Error ? error.message : "Failed to process upload",
//       },
//       { status: 500 },
//     );
//   }
// }

// export const config = {
//   api: {
//     bodyParser: false,
//     responseLimit: "10mb",
//   },
// };

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: "Hello from face-detect" });
}
