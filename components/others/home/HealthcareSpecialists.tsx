import Image from "next/image";
import ImageGallery from "./ImageGallary";

export default function HealthcareSpecialists() {
  return (
    <div className="max-w-6xl mx-auto p-8 mt-24 mb-20 bg-gray-50 rounded-3xl border border-gray-100">
      <div className="grid md:grid-cols-2 justify-center items-center gap-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-btnblue leading-tight">
              Sexual Healthcare specialists
            </h2>
            <p className="mt-4 text-gray-600 text-lg">
              We have a multidisciplinary team of India's best healthcare
              doctors and therapists from fields of psychiatry, cardiology,
              psychology and general medicine.
            </p>
          </div>

          <p className="text-gray-600 text-lg">
            All our doctors & therapists go through rigorous training through
            our Advanced Medicine Course to ensure standardised, high quality
            care delivery to patients across India.
          </p>

          <div className="flex items-center mt-6">
            <div className="bg-[#F8F6FE] px-4 py-2 rounded-full inline-flex items-center">
              <span className="text-btnblue text-2xl font-bold mr-2">10+</span>
              <span className="text-gray-500">Years of average experience</span>
            </div>
          </div>
        </div>

        <ImageGallery />
      </div>
    </div>
  );
}
