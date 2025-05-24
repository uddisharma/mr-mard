import MultiStepForm from "@/components/others/analysis";
import { db } from "@/lib/db";
import React from "react";

export const metadata = {
  title: "Analyze",
  description: "Analyze",
};

const Page = async () => {
  const questions = await db.question.findMany({
    where: { isActive: true },
    include: { options: true },
    orderBy: { sequence: "asc" },
  });

  return (
    <div>
      <MultiStepForm data={questions} />
    </div>
  );
};

export default Page;
