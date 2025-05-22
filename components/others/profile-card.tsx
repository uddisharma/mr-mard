"use client";

import { Camera, Copy } from "lucide-react";
import { useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User } from "@/schemas/types";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { uploadFile } from "@/actions/upload";
import { updateProfilePhoto } from "@/actions/my-profile";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

type Props = {
  admin: Pick<
    User,
    "firstName" | "lastName" | "phone" | "email" | "location" | "image" | "role"
  > | null;
  stats: {
    newUsers: number;
    reports: number;
    questions: number;
  };
};

export default function ProfileCard({ admin, stats }: Props) {
  const [timeframe, setTimeframe] = useState<"1M" | "6M" | "1Y" | "ALL">("1M");
  const [isOpen, setIsOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { update } = useSession();
  const searchParams = useSearchParams();

  const handleTimeRangeChange = (range: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (range === "ALL TIME") {
      params.delete("timeRange");
    } else {
      params.set("timeRange", range);
    }
    router.push(`?${params.toString()}`);
  };

  const handleImageUpload = (formData: FormData) => {
    startTransition(async () => {
      try {
        const result = await uploadFile(formData);
        const data = await updateProfilePhoto(result.url);
        if (data?.success) {
          admin!.image = result.url;
          setIsOpen(false);
          setPreviewImage(null);
          update();
        } else {
          toast.error(data?.error);
        }
      } catch (error) {
        toast.error("Something went wrong !");
      }
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  function formatRole(role: string | undefined): string | undefined {
    if (!role) return undefined;
    const words = role.split("_");
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(" ");
  }

  return (
    <>
      <Card className="w-full max-w-md mx-auto bg-white">
        <CardHeader className="flex flex-col items-center space-y-2 pt-6">
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarImage src={admin?.image || "/blogs3.png"} />
              <AvatarFallback>{admin?.firstName}</AvatarFallback>
            </Avatar>
            <button
              className="absolute bottom-0 right-0 bg-blue-100 rounded-full p-2"
              onClick={() => setIsOpen(true)}
            >
              <Camera className="w-4 h-4 text-blue-600" />
            </button>
          </div>
          <h2 className="text-2xl font-semibold mt-4">
            {admin?.firstName} {admin?.lastName}
          </h2>
          <p className="text-muted-foreground">
            {formatRole(admin?.role ?? "Founder")}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex rounded-full bg-slate-100 p-[12px_32px]">
            {["1M", "6M", "1Y", "ALL"].map((period) => (
              <button
                key={period}
                onClick={() => {
                  setTimeframe(period as any);
                  handleTimeRangeChange(period as any);
                }}
                className={`flex-1 py-1 text-[12px] rounded-full transition-colors ${
                  timeframe === period
                    ? "bg-white shadow-sm"
                    : "hover:bg-white/50"
                }`}
              >
                {period === "ALL" ? "ALL TIME" : period}
              </button>
            ))}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between py-3">
              <span className="text-muted-foreground">New Users</span>
              <span className="font-medium">{stats?.newUsers}</span>
            </div>
            <div className="flex justify-between py-3 border-t">
              <span className="text-muted-foreground">Reports</span>
              <span className="font-medium">{stats?.reports}</span>
            </div>
            <div className="flex justify-between py-3 border-t">
              <span className="text-muted-foreground">Questions</span>
              <span className="font-medium">{stats?.questions}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 rounded-lg border-[1px] border-btnblue p-3 mt-4 text-center">
            <span className="text-btnblue rounded-full px-3 py-1 flex-1 truncate">
              View public profile
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-lg border p-3 mt-4">
            <span className="text-muted-foreground flex-1 truncate">
              https://app.milele.health
            </span>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Profile Picture</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleImageUpload(formData);
            }}
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                <Avatar className="w-32 h-32">
                  <AvatarImage
                    src={previewImage || admin?.image || "/blogs3.png"}
                  />
                  <AvatarFallback>{admin?.firstName}</AvatarFallback>
                </Avatar>
              </div>
              <input
                type="file"
                accept="image/*"
                id="image"
                name="image"
                onChange={handleFileChange}
                className="w-full"
              />
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button disabled={isPending || !previewImage} type="submit">
                  {isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
