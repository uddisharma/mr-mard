"use client";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { useRouter, useSearchParams } from "next/navigation";
import { encryptPhoneNumber } from "@/lib/encryption";
import { registerWithOTP } from "@/actions/register-phone";
import { toast } from "sonner";

const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Phone number must be exactly 10 digits.")
    .max(10, "Phone number must be exactly 10 digits.")
    .regex(/^[0-9]+$/, "Phone number must contain only numbers."),
});

type PhoneFormInputs = z.infer<typeof phoneSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const params = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PhoneFormInputs>({
    resolver: zodResolver(phoneSchema),
  });

  const onSubmit = async (data: PhoneFormInputs) => {
    try {
      const response = await registerWithOTP({ phone: data.phoneNumber });
      if (!response.success) {
        toast.error(response.message);
      }
      toast.success(response.message);
      const encryptedPhone = encryptPhoneNumber(data.phoneNumber);
      router.push(
        `/otp?token=${encryptedPhone} ${params?.get("redirect") && `&redirect=${params.get("redirect")}`}`,
      );
    } catch (error: any) {
      toast.error(error.message || "An error occurred.");
    }
  };

  return (
    <>
      <div className="flex flex-wrap bg-white p-5">
        <div className="w-full lg:w-1/2 md:p-12">
          <div className="max-w-md">
            <h1 className="text-[32px] mb-3">Sign up</h1>

            <p className="text-gray-600 mb-8 md:mb-16">
              If you already have an account register
              <br />
              you can
              <Link
                href="/auth"
                className="text-[#115FD6] hover:underline ml-1 font-semibold"
              >
                Login here !
              </Link>
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-8 md:space-y-10"
            >
              <div className="space-y-2">
                <label className="block text-gray-500 text-sm">
                  Contact Number
                </label>
                <div className="flex gap-3">
                  <div className="flex items-center gap-2 border border-black rounded-[11px] px-3 py-2.5 bg-white w-[90px] h-[40px] md:h-[40px]">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span className="text-gray-600">+91</span>
                  </div>
                  <input
                    type="tel"
                    placeholder="00000 00000"
                    maxLength={10}
                    className="flex-1 border border-black rounded-[11px] px-4 py-2.5 focus:outline-none focus:border-[#1E1B4B] h-[40px] md:h-[40px] text-center w-full"
                    {...register("phoneNumber")}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              <Separator className="mb-5 bg-[#999]" />

              <button
                type="submit"
                className="w-full bg-[#1E1B4B] text-white py-3 rounded-lg hover:bg-btnblue transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Verifying..." : "Verify OTP"}
              </button>
            </form>

            <Link
              href="/admin"
              className="text-[#0C21C1] font-semibold hover:underline mt-28 md:inline-block hidden"
            >
              Admin's Panel !
            </Link>
          </div>
        </div>

        {/* Right Section */}
        <div className="hidden lg:block w-1/2 bg-yellow relative rounded-lg">
          <div className="absolute top-8 right-8">
            <p className="text-gray-600 text-lg">+91 8861452659</p>
          </div>

          <div className="absolute left-0 right-0 top-[75%] bottom-32 text-left w-full px-10">
            <h2 className="text-[35px] text-btnblue">Sign up to Mr. Mard</h2>
            <p className="text-btnblue text-lg">Get started with us</p>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-[40%] -translate-y-[60%] w-[400px] h-[400px]">
            <Image
              src="/auth.png"
              alt="Person working at desk illustration"
              width={300}
              height={270}
              className="object-contain w-full h-full"
              priority
            />
          </div>
        </div>

        {/* Mobile View */}
        <div className="h-[300px] w-full bg-yellow md:hidden mt-8">
          <Image
            src="/register.png"
            alt="Person working at desk illustration"
            width={300}
            height={270}
            className="object-contain w-full h-full p-5"
            priority
          />
        </div>
      </div>
    </>
  );
}
