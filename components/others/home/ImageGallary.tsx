import Image from "next/image";

export default function ImageGallery() {
  return (
    <div className="w-full p-4 md:p-8">
      <div className="grid grid-flow-col grid-rows-3 gap-4">
        <div className="... row-span-3">
          <div className="rounded-2xl overflow-hidden h-48 md:h-64">
            <Image
              src="/ai.png"
              alt="Ocean waves"
              width={600}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
