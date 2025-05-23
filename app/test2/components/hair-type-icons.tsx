interface HairTypeIconsProps {
  hairType: string;
  densityClass: string;
}

export function HairTypeIcons({ hairType, densityClass }: HairTypeIconsProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full max-w-xs bg-gray-100 rounded-full p-2 mb-4">
        <div className="flex flex-col items-center">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${hairType === "Straight" ? "bg-white border-2 border-gray-300" : "bg-gray-100"}`}
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-600"
            >
              <path d="M12 2v20M2 12h20" />
            </svg>
          </div>
          <span className="text-sm mt-1">Straight</span>
        </div>

        <div className="flex flex-col items-center">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${densityClass === "Low" ? "bg-white border-2 border-gray-300" : "bg-gray-100"}`}
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-600"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </div>
          <span className="text-sm mt-1">Low</span>
        </div>

        <div className="flex flex-col items-center">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center bg-black`}
          ></div>
          <span className="text-sm mt-1">Black</span>
        </div>
      </div>
    </div>
  );
}
