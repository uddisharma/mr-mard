import React from "react";

const HairBellCurve = ({ data }: { data: any }) => {
  const { estimated_hair_count, expected_range } = data;
  const { min, max } = expected_range;
  const range = max - min;

  const diffToMin = Math.abs(estimated_hair_count - min);
  const diffToMax = Math.abs(estimated_hair_count - max);
  const closerTo = diffToMin < diffToMax ? "min" : "max";
  const userColor = closerTo === "min" ? "#ef4444" : "#22c55e";

  const percent = ((estimated_hair_count - min) / range) * 100;
  const xUser = 10 + percent * 0.8;
  const userHairText = (estimated_hair_count / 1000).toFixed(0) + "k";

  const maxHairLimit = (expected_range.max / 1000).toFixed(0) + "k";
  const minHairLimit = (expected_range.min / 1000).toFixed(0) + "k";

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-3xl shadow-xl">
      <svg viewBox="0 0 100 60" className="w-full h-auto">
        {/* Gradient fill for curve */}
        <defs>
          <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Bell curve shape */}
        <path
          d="M 10 50 Q 50 0 90 50"
          stroke="#1f2937"
          strokeWidth="1"
          fill="url(#curveGradient)"
          style={{
            stroke: "#1f2937",
            strokeWidth: "1.5",
            fill: "url(#curveGradient)",
            borderRadius: "10px",
          }}
        />

        <line
          x1="0"
          x2="100"
          y1="50"
          y2="50"
          stroke="#b5b5b5"
          strokeWidth="0.5"
        />

        <line
          x1="50"
          x2="50"
          y1="50"
          y2="18"
          stroke="#9ca3af"
          strokeWidth="1"
        />
        <text x="50" y="54" fontSize="3" fill="black" textAnchor="middle">
          Age Avg
        </text>

        <line
          x1={xUser}
          x2={xUser}
          y1="50"
          y2="15"
          stroke={userColor}
          strokeWidth="1"
        />
        <polygon
          points={`${xUser - 2.5},15 ${xUser + 2.5},15 ${xUser},10`}
          fill={userColor}
          strokeWidth="4"
          transform={`rotate(180, ${xUser}, 15)`}
        />
        <text
          x={xUser}
          y="13"
          fontSize="5"
          fontWeight="bold"
          fill={userColor}
          textAnchor="middle"
        >
          {userHairText}
        </text>
        <text
          x={xUser}
          y="54"
          fontSize="3"
          fill="black"
          stroke="1.2"
          textAnchor="middle"
        >
          You
        </text>

        <text x="8" y="55" fontSize="3" fill="black">
          {minHairLimit}
        </text>
        <text x="95" y="55" fontSize="3" fill="black" textAnchor="end">
          {maxHairLimit}
        </text>
      </svg>
    </div>
  );
};

export default HairBellCurve;
