"use client";

import { useEffect, useRef } from "react";

export function HairTrendChart() {
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

    // Draw x-axis labels
    ctx.font = "12px Inter, system-ui, sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.textAlign = "center";
    ctx.fillText("0 year", 20, height - 10);
    ctx.fillText("1 year", width - 20, height - 10);

    // Draw vertical line for "Today"
    const todayX = width / 2;
    ctx.beginPath();
    ctx.moveTo(todayX, 10);
    ctx.lineTo(todayX, height - 30);
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw "Today" label
    ctx.fillStyle = "#1e3a5f";
    ctx.beginPath();
    ctx.roundRect(todayX - 30, height - 25, 60, 20, 10);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.fillText("Today", todayX, height - 12);

    // Draw trend lines
    // Past trend (blue)
    const gradient1 = ctx.createLinearGradient(0, 0, todayX, 0);
    gradient1.addColorStop(0, "rgba(147, 197, 253, 0.5)");
    gradient1.addColorStop(1, "rgba(147, 197, 253, 0.8)");

    ctx.beginPath();
    ctx.moveTo(0, height / 2 + 20);
    ctx.bezierCurveTo(
      width / 6,
      height / 2 + 10,
      width / 3,
      height / 2 - 10,
      todayX,
      height / 2,
    );
    ctx.lineTo(todayX, height - 30);
    ctx.lineTo(0, height - 30);
    ctx.closePath();
    ctx.fillStyle = gradient1;
    ctx.fill();

    // Future trend (green)
    const gradient2 = ctx.createLinearGradient(todayX, 0, width, 0);
    gradient2.addColorStop(0, "rgba(134, 239, 172, 0.8)");
    gradient2.addColorStop(1, "rgba(134, 239, 172, 0.5)");

    ctx.beginPath();
    ctx.moveTo(todayX, height / 2);
    ctx.bezierCurveTo(
      todayX + width / 6,
      height / 2 - 20,
      todayX + width / 3,
      height / 2 - 30,
      width,
      height / 2 - 40,
    );
    ctx.lineTo(width, height - 30);
    ctx.lineTo(todayX, height - 30);
    ctx.closePath();
    ctx.fillStyle = gradient2;
    ctx.fill();

    // Draw trend line
    ctx.beginPath();
    ctx.moveTo(0, height / 2 + 20);
    ctx.bezierCurveTo(
      width / 6,
      height / 2 + 10,
      width / 3,
      height / 2 - 10,
      todayX,
      height / 2,
    );
    ctx.bezierCurveTo(
      todayX + width / 6,
      height / 2 - 20,
      todayX + width / 3,
      height / 2 - 30,
      width,
      height / 2 - 40,
    );
    ctx.strokeStyle = "#4b5563";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw data points
    // Current point
    ctx.beginPath();
    ctx.arc(todayX, height / 2, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw data labels
    // Future prediction
    ctx.beginPath();
    ctx.roundRect(width - 80, height / 2 - 60, 70, 25, 5);
    ctx.fillStyle = "#22c55e";
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 12px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("145908", width - 45, height / 2 - 45);

    // Past data
    ctx.beginPath();
    ctx.roundRect(width - 80, height / 2 + 10, 70, 25, 5);
    ctx.fillStyle = "#ef4444";
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 12px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("91294", width - 45, height / 2 + 25);
  }, []);

  return (
    <div className="w-full">
      <canvas ref={canvasRef} className="w-full h-48" />
    </div>
  );
}
