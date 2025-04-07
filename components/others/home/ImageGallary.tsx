import Image from "next/image";

export default function ImageGallery() {
  return (
    <div className="w-full p-4 md:p-8">
      <div className="rounded-2xl overflow-hidden h-full">
        <Image
          src="/appointment/Treatment.png"
          alt="Ocean waves"
          width={400}
          height={400}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
