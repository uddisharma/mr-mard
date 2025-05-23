"use server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface AnalysisData {
  reportId: number;
  analysis: Record<string, any>;
}

export async function analyzeHair(data: AnalysisData) {
  const session = await currentUser();
  if (!session) {
    return redirect("/auth");
  }

  // try {
  //     // Create a new FormData instance for the API request
  //     const apiFormData = new FormData();
  //     const file = formData.get("file") as File;
  //     if (file) {
  //         apiFormData.append("file", file);
  //         apiFormData.append("image", file);
  //     }

  //     console.log("apiFormData", apiFormData);

  //     const response = await fetch("https://api.milele.health/validate-image", {
  //         method: "POST",
  //         headers: {
  //             "Accept": "application/json",
  //         },
  //         body: apiFormData,
  //     });
  //     const data = await response.json();

  //     if (data.valid) {
  //         const response1 = await fetch("https://api.milele.health/analyze-hair", {
  //             method: "POST",
  //             headers: {
  //                 "Accept": "application/json",
  //             },
  //             body: apiFormData,
  //         });
  //         const data1 = await response1.json();
  //         return {
  //             success: true,
  //             valid: true,
  //             data: data1,
  //             message: "Hair analysis completed successfully",
  //         }
  //     } else {
  //         console.log("data", data);
  //         return {
  //             success: false,
  //             valid: false,
  //             data: null,
  //             message: "Image is invalid",
  //         }
  //     }
  // } catch (error: any) {
  //     console.error("Server action error:", error);
  //     return {
  //         success: false,
  //         valid: false,
  //         data: null,
  //         message: error.message || "Error analyzing hair",
  //     }
  // }

  try {
    const res = await db.analysis.create({
      data: {
        userId: session?.id,
        reportId: data?.reportId,
        analysis: data?.analysis as any,
      },
    });

    return {
      success: true,
      message: "Analysis successfully saved",
    };
  } catch (error) {
    console.error("Server action error:", error);
    return {
      success: false,
      message: "Error saving analysis",
    };
  }
}
