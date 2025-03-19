"use client";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
const chartData = [
  { month: "January", reports: 186, treatments: 80 },
  { month: "February", reports: 305, treatments: 200 },
  { month: "March", reports: 237, treatments: 120 },
  { month: "April", reports: 73, treatments: 190 },
  { month: "May", reports: 209, treatments: 130 },
  { month: "June", reports: 214, treatments: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "#87cefa",
  },
} satisfies ChartConfig;

export default function Component() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!isMobile) {
    return (
      <div className="h-full bg-white pb-1">
        <h2 className="text-3xl md:text-4xl text-center text-btnblue pt-8 pb-5">
          Track Your Progress
        </h2>
        <div className="relative">
          <div className="h-[65px] w-[65px] bg-yellow rounded-full flex items-center justify-center m-auto absolute top-[30%] left-[15%] right-[80%]"></div>
          <ChartContainer
            className="m-auto h-[400px] md:w-[530px] my-16"
            config={chartConfig}
          >
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="reports"
                type="natural"
                fill="var(--color-mobile)"
                fillOpacity={0.4}
                stroke="var(--color-mobile)"
                stackId="a"
              />
              <Area
                dataKey="treatments"
                type="natural"
                fill="var(--color-desktop)"
                fillOpacity={0.4}
                stroke="var(--color-desktop)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </div>
      </div>
    );
  }
}
