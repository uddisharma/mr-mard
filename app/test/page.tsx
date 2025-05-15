"use client";
import React from "react";

const page = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;
    formData.append("image", file, "captured-image.png");

    console.log("Form data before sending:", file);

    try {
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
    } catch (error) {
      console.error("Error handling upload:", error);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" name="file" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default page;
