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
  // const analysisData = data.analysis?.analysis;

  const analysisData = {
    density: 5.195277777777778,
    scaled_density: 31.836435524365562,
    coverage: {
      overall: 0.0947258472442627,
      frontal: 0.18860484659671783,
      crown: 0.027234937995672226,
    },
    regional_densities: [
      13.894375, 22.514375, 6.29, 2.998125, 0.0, 1.060625, 0.0, 0.0, 0.0,
    ],
    hair_type: "Straight",
    hair_type_confidence: 0.9563312530517578,
    density_class: "Medium",
    hair_condition: "oily",
    condition_confidence: 0.42213141918182373,
    overall_score: 48.53905555555556,
    future_prediction: {
      ages: [
        25.0, 26.0, 27.0, 28.0, 29.0, 30.0, 31.0, 32.0, 33.0, 34.0, 35.0, 36.0,
        37.0, 38.0, 39.0, 40.0, 41.0, 42.0, 43.0, 44.0, 45.0,
      ],
      densities: [
        5.195277777777778, 4.941901090676904, 4.700881730424042,
        4.471617023077182, 4.253533687449304, 4.046086401606802,
        3.848756439280603, 3.661050372780305, 3.4824988391679343,
        3.3126553666061187, 3.15109525794594, 2.997414528762845,
        2.8512288971851603, 2.7121728229892454, 2.5798985935585366,
        2.4540754544208885, 2.3343887821901097, 2.220539297843621,
        2.1122423183690073, 2.0092270449082044, 1.9112358856193017,
      ],
    },
    estimated_hair_count: 102734,
    expected_range: { min: 90000, max: 130000 },
  };

  return <HairAnalysis data={analysisData} />;
}
