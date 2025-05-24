import HairAnalysis from "@/components/others/Analyze";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Report",
  description: "Report",
};

export default async function Report({ params }: { params: { id: string } }) {
  const { id } = params;
  const data = await db.analysis.findUnique({
    where: {
      id: id,
    },
  });

  if (!data) notFound();

  // @ts-ignore
  const analysisData = data.analysis?.analysis;

  return <HairAnalysis data={analysisData} />;
}
