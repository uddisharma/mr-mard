// "use client";
// import React from "react";
// import Image from "next/image";
// export function Chart1() {
//   return (
// <div className="bg-white mb-8  md:grid grid-cols-1 lg:grid-cols-2 justify-center gap-10 m-auto md:py-10 hidden">
//   <Image
//     src={"/home-chart2.png"}
//     width={500}
//     height={500}
//     alt="Home Chart"
//     className="m-auto"
//   />
//   <Image
//     src={"/home-chart3.png"}
//     width={500}
//     height={500}
//     alt="Home Chart"
//     className="m-auto"
//   />
// </div>
//   );
// }

"use client";

import * as React from "react";
import { Bar, BarChart, Label, Pie, PieChart, Sector, XAxis } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import { CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Footprints, Waves } from "lucide-react";
const desktopData = [
  { month: "january", desktop: 186, fill: "var(--color-january)" },
  { month: "february", desktop: 305, fill: "var(--color-february)" },
  { month: "march", desktop: 237, fill: "var(--color-march)" },
  { month: "april", desktop: 173, fill: "var(--color-april)" },
  { month: "may", desktop: 209, fill: "var(--color-may)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
  },
  mobile: {
    label: "Mobile",
  },
  january: {
    label: "January",
    color: "#Fca510",
  },
  february: {
    label: "February",
    color: "#87cefa",
  },
  march: {
    label: "March",
    color: "hsl(var(--chart-3))",
  },
  april: {
    label: "April",
    color: "#87cefa",
  },
  may: {
    label: "May",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export default function Component() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const id = "pie-interactive";
  const [activeMonth, setActiveMonth] = React.useState(desktopData[0].month);

  const activeIndex = React.useMemo(
    () => desktopData.findIndex((item) => item.month === activeMonth),
    [activeMonth],
  );

  const chartData1 = [
    { date: "2024-07-15", haircuts: 350, hairTreatments: 190 },
    { date: "2024-07-16", haircuts: 370, hairTreatments: 120 },
    { date: "2024-07-17", haircuts: 250, hairTreatments: 180 },
    { date: "2024-07-18", haircuts: 210, hairTreatments: 140 },
    { date: "2024-07-19", haircuts: 350, hairTreatments: 160 },
    { date: "2024-07-20", haircuts: 250, hairTreatments: 130 },
    { date: "2024-07-21", haircuts: 180, hairTreatments: 110 },
    { date: "2024-07-22", haircuts: 310, hairTreatments: 150 },
    { date: "2024-07-23", haircuts: 280, hairTreatments: 100 },
    { date: "2024-07-24", haircuts: 340, hairTreatments: 170 },
  ];

  const chartConfig1 = {
    running: {
      label: "Running",
      color: "#Fca510",
      icon: Footprints,
    },
    swimming: {
      label: "Swimming",
      color: "#87cefa",
      icon: Waves,
    },
  } satisfies ChartConfig;

  if (!isMobile) {
    return (
      <div className="mb-1 md:grid grid-cols-1 lg:grid-cols-2 justify-center gap-5 m-auto md:py-20 hidden mx-12">
        <div className="flex flex-col w-full max-w-[550px] h-[400px] m-auto bg-white shadow-lg rounded-lg px-10 justify-center items-center">
          <ChartContainer
            config={chartConfig1}
            className="flex justify-center items-center w-full"
          >
            <BarChart accessibilityLayer data={chartData1} barSize={30}>
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => {
                  return new Date(value).toLocaleDateString("en-US", {
                    weekday: "short",
                  });
                }}
              />
              <Bar
                dataKey="haircuts"
                stackId="a"
                fill="var(--color-running)"
                radius={[0, 0, 4, 4]}
              />
              <Bar
                dataKey="hairTreatments"
                stackId="a"
                fill="var(--color-swimming)"
                radius={[4, 4, 0, 0]}
              />
              <ChartTooltip
                content={<ChartTooltipContent hideLabel />}
                cursor={false}
                defaultIndex={1}
              />
            </BarChart>
          </ChartContainer>
        </div>
        <div className="flex flex-col w-full max-w-[550px] h-[400px] m-auto bg-white shadow-lg rounded-lg">
          <ChartStyle id={id} config={chartConfig} />
          <CardContent className="flex flex-1 justify-center pb-0">
            <ChartContainer
              id={id}
              config={chartConfig}
              className="mx-auto aspect-square w-full max-w-[300px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={desktopData}
                  dataKey="desktop"
                  nameKey="month"
                  innerRadius={60}
                  strokeWidth={5}
                  activeIndex={activeIndex}
                  activeShape={({
                    outerRadius = 0,
                    ...props
                  }: PieSectorDataItem) => (
                    <g>
                      <Sector {...props} outerRadius={outerRadius + 10} />
                      <Sector
                        {...props}
                        outerRadius={outerRadius + 25}
                        innerRadius={outerRadius + 12}
                      />
                    </g>
                  )}
                >
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
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {desktopData[
                                activeIndex
                              ].desktop.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Visitors
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </div>
      </div>
    );
  }
}
