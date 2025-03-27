import Image from "next/image";

export default function SpecialistsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h2 className="text-4xl md:text-5xl font-bold text-purple-800">
          Sexual health specialists
        </h2>

        <p className="text-gray-500">
          We have a multidisciplinary team of India's best sexual health doctors
          and therapists from fields of psychiatry, andrology, psychology and
          general sexual medicine.
        </p>

        <p className="text-gray-500">
          All our doctors & therapists go through rigorous training through Allo
          Sexual Medicine Course to ensure standardised, high quality care
          delivery to patients across India.
        </p>

        <div className="flex items-center gap-3 mt-8">
          <div className="text-2xl font-bold text-purple-800">10+</div>
          <div className="text-gray-500">Years of average experience</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Doctor 1 */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
                <Image
                  src="/placeholder.svg?height=200&width=200"
                  alt="Dr. Sandeep Deshpande"
                  width={200}
                  height={200}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            <div className="w-full md:w-2/3">
              <h3 className="text-xl font-semibold text-purple-800">
                Dr. Sandeep Deshpande
              </h3>
              <p className="text-gray-500">MBBS, MD (Psy.), DNB (Psy.)</p>
              <p className="text-gray-500 mt-2">Bangalore • 20+ Yrs exp.</p>
            </div>
          </div>
        </div>

        {/* Doctor 2 */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
                <Image
                  src="/placeholder.svg?height=200&width=200"
                  alt="Dr. Nikunj Gokani"
                  width={200}
                  height={200}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            <div className="w-full md:w-2/3">
              <h3 className="text-xl font-semibold text-purple-800">
                Dr. Nikunj Gokani
              </h3>
              <p className="text-gray-500">MBBS, MD (Psy.)</p>
              <p className="text-gray-500 mt-2">Mumbai • 9+ Yrs exp.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
