"use client";
import { analyzeHair } from "@/actions/analyze";
import { uploadFile } from "@/actions/upload";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (file) {
        const formData = new FormData();
        formData.append("image", file, "captured-image.png");
        formData.append("file", file);

        const response = await fetch(
          "https://api.milele.health/validate-image",
          {
            method: "POST",
            headers: {
              accept: "application/json",
              "accept-language": "en-US,en;q=0.9",
            },
            body: formData,
          },
        );

        const data = await response.json();
        if (!data?.valid) {
          return toast.error(data?.message);
        }

        const response1 = await fetch(
          "https://api.milele.health/analyze-hair",
          {
            method: "POST",
            headers: {
              accept: "application/json",
              "accept-language": "en-US,en;q=0.9",
            },
            body: formData,
          },
        );

        const data1 = await response1.json();
        return console.log(data1);
        const formData1 = new FormData();
        formData1.append("image", file);
        const uploaded = await uploadFile(formData1);
        const analizedData = {
          image: uploaded.url,
          analysis: data1,
        };
        const res = await analyzeHair({
          reportId: 8,
          analysis: analizedData,
        });
        if (res.success) {
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
        localStorage.removeItem("reportId");
        localStorage.removeItem("startTime");
        router.push(`/report`);
      }
    } catch (error: any) {
      console.error("Error:", error?.message);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Page;
