"use client";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

export default function Score({ score }: { score: number }) {
  const chartData = [{ desktop: score, mobile: 100 - score }];

  const chartConfig = {
    desktop: {
      label: "Hair Count",
      color: "#6976eb",
    },
    mobile: {
      label: "Hair Type",
      color: "#f2f3f6",
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col">
      <div className="flex flex-1 items-center pb-0">
        {/* @ts-ignore */}
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius={85}
            outerRadius={120}
            barSize={15}
            data={chartData}
            startAngle={210}
            endAngle={-30}
          >
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          className="fill-foreground text-4xl font-bold"
                          fontSize={28}
                          fontWeight={700}
                        >
                          {score} /
                        </tspan>
                        <tspan
                          className="fill-foreground text-md font-bold"
                          fontSize={20}
                          fontWeight={500}
                          dx={8}
                        >
                          100
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="desktop"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-desktop)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="mobile"
              fill="var(--color-mobile)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
          <div className="relative">
            <div className="absolute left-0 top-[-70px] md:top-[-50px] w-full h-full">
              <div className="flex flex-row items-center justify-between md:mx-5 mx-10 text-[#babbc6]">
                <p className="text-lg font-semibold">00</p>
                <p className="text-lg font-semibold">100</p>
              </div>
            </div>
          </div>
        </ChartContainer>
      </div>
    </div>
  );
}
