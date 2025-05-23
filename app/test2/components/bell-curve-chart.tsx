"use client";

import { useEffect, useRef } from "react";

interface BellCurveChartProps {
  value: number;
  average: number;
  label: string;
  color?: string;
}

export function BellCurveChart({
  value,
  average,
  label,
  color = "red",
}: BellCurveChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions with higher resolution for retina displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Calculate dimensions
    const width = rect.width;
    const height = rect.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw bell curve
    ctx.beginPath();
    ctx.moveTo(0, height - 20);

    for (let x = 0; x < width; x++) {
      // Bell curve formula
      const normalizedX = (x - width / 2) / (width / 6);
      const y =
        (Math.exp(-(normalizedX * normalizedX) / 2) * (height - 40)) / 1.5;
      ctx.lineTo(x, height - 20 - y);
    }

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw average line
    const averageX = width / 2;
    ctx.beginPath();
    ctx.moveTo(averageX, height - 15);
    ctx.lineTo(averageX, 20);
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw value marker
    // Normalize the value to be within the bell curve
    const normalizedValue = value / average - 0.5;
    const valueX = width / 2 + (normalizedValue * width) / 3;

    // Draw value line
    ctx.beginPath();
    ctx.moveTo(valueX, height - 15);
    ctx.lineTo(valueX, 20);
    ctx.strokeStyle = color === "red" ? "#ef4444" : "#22c55e";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw triangle marker
    ctx.beginPath();
    ctx.moveTo(valueX, 10);
    ctx.lineTo(valueX - 8, 0);
    ctx.lineTo(valueX + 8, 0);
    ctx.closePath();
    ctx.fillStyle = color === "red" ? "#ef4444" : "#22c55e";
    ctx.fill();

    // Draw label
    ctx.font = "bold 12px Inter, system-ui, sans-serif";
    ctx.fillStyle = color === "red" ? "#ef4444" : "#22c55e";
    ctx.textAlign = "center";
    ctx.fillText(label, valueX, 25);

    // Draw "You" and "Age Average" labels
    ctx.font = "8px Inter, system-ui, sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.textAlign = "center";
    const gap = Math.abs(valueX - averageX) < 40 ? 30 : 20;
    ctx.fillText("You", valueX - gap, height - 5);
    ctx.fillText("Age Average", averageX + gap, height - 5);
  }, [value, average, label, color]);

  return (
    <div className="w-full">
      <canvas ref={canvasRef} className="w-full h-32" />
    </div>
  );
}
