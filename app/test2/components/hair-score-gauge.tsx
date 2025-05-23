"use client";

import { useEffect, useRef } from "react";

interface HairScoreGaugeProps {
  score: number;
}

export function HairScoreGauge({ score }: HairScoreGaugeProps) {
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
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 10;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background arc (gray)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI * 0.75, Math.PI * 2.25, false);
    ctx.lineWidth = 15;
    ctx.strokeStyle = "#f1f5f9";
    ctx.stroke();

    // Draw score arc (blue)
    const scorePercentage = score / 100;
    const endAngle = Math.PI * 0.75 + Math.PI * 1.5 * scorePercentage;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI * 0.75, endAngle, false);
    ctx.lineWidth = 15;
    ctx.strokeStyle = "#818cf8";
    ctx.stroke();

    // Draw score text
    ctx.font = "bold 32px Inter, system-ui, sans-serif";
    ctx.fillStyle = "#1e293b";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${score}`, centerX, centerY - 10);

    // Draw denominator
    ctx.font = "16px Inter, system-ui, sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText("/100", centerX, centerY + 15);

    // Draw min and max labels
    ctx.font = "12px Inter, system-ui, sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.textAlign = "center";
    ctx.fillText("00", centerX - radius, centerY + radius / 2);
    ctx.fillText("100", centerX + radius, centerY + radius / 2);
  }, [score]);

  return (
    <div className="relative w-48 h-48">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
