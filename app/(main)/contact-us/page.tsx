"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Mail, Phone } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactFormData, contactSchema } from "@/schemas";
import { useTransition } from "react";
import { submitContactForm } from "@/actions/contacts";
import { toast } from "sonner";
import { IconBrandInstagram, IconBrandYoutube } from "@tabler/icons-react";
import FAQ from "@/components/others/faq";

export default function ContactPage() {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactFormData) => {
    startTransition(async () => {
      const res = await submitContactForm(data);
      if (res?.success) {
        toast.success(res.message);
        reset();
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <div className="md:px-24">
      {/* Main Content */}
      <main className="mx-auto px-4 py-2 md:py-6 mb-10">
        <div className="text-center mb-6">
          <h1 className="text-4xl text-btnblue mb-4">Contact Us</h1>
          <p className="text-[#717171]">
            Any question or remarks? Just write us a message !
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 bg-white p-5 w-full">
          {/* Contact Information */}
          <div
            style={{
              backgroundImage: 'url("/contact-us.png")',
              backgroundSize: "250px",
              backgroundPosition: "right bottom",
              backgroundRepeat: "no-repeat",
            }}
            className="bg-[#011C2B] text-white p-8 rounded-lg"
          >
            <h2 className="text-2xl mb-6">Contact Information</h2>
            <p className="text-gray-300 mb-8">
              Say something to start a live chat!
            </p>

            <div className="space-y-8 md:space-y-12 md:mt-32">
              <div className="flex items-center gap-4">
                <Phone className="h-5 w-5" />
                <span>+91 8861452659</span>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="h-5 w-5" />
                <span>contactus@mrmard.com</span>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="h-9 w-9" />
                <span>
                  302, 12th main, Mahadeshwara Nagar, Stage 2, BTM Layout,
                  Bengaluru, Karnataka, 560076
                </span>
              </div>
            </div>

            <div className="flex gap-4 mt-10 md:mt-40">
              <a
                href={`https://youtube.com/@mrmard_official?si=wWuuxQwTgVgOtnND`}
                target="_blank"
                className="bg-white/10 p-2 rounded-full hover:bg-white/20"
              >
                <IconBrandYoutube className="w-5 h-5 rounded-full" />
              </a>
              <a
                href={`https://www.instagram.com/mr.mardofficial`}
                target="_blank"
                className="bg-white/10 p-2 rounded-full hover:bg-white/20"
              >
                <IconBrandInstagram className="w-5 h-5 rounded-full" />
              </a>
              <a
                href={`https://youtube.com/@mrmard_official?si=wWuuxQwTgVgOtnND`}
                target="_blank"
                className="bg-white/10 p-2 rounded-full hover:bg-white/20"
              >
                <IconBrandYoutube className="w-5 h-5 rounded-full" />
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-10">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="First Name"
                  className="border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-[#1a2642] px-0"
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Last Name"
                  className="border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-[#1a2642] px-0"
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  className="border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-[#1a2642] px-0"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-5">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 012 3456 789"
                  className="border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-[#1a2642] px-0"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-5">
              <Label>Select Subject?</Label>
              <Controller
                name="subject"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="general1" id="general1" />
                      <Label htmlFor="general1">General Inquiry</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="general2" id="general2" />
                      <Label htmlFor="general2">General Inquiry</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="general3" id="general3" />
                      <Label htmlFor="general3">General Inquiry</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="general4" id="general4" />
                      <Label htmlFor="general4">General Inquiry</Label>
                    </div>
                  </RadioGroup>
                )}
              />
              {errors.subject && (
                <p className="text-red-500 text-sm">{errors.subject.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Write your message.."
                className="min-h-[120px] border-0 border-b rounded-none focus-visible:ring-0 focus-visible:border-[#1a2642] px-0"
                {...register("message")}
              />
              {errors.message && (
                <p className="text-red-500 text-sm">{errors.message.message}</p>
              )}
            </div>
            <div className="flex items-end justify-end">
              <Button
                disabled={isPending}
                type="submit"
                className="w-full md:w-auto bg-btnblue text-white mt-10"
              >
                {isPending ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </main>
      <div className="mb-20">
        <FAQ />
      </div>
    </div>
  );
}
