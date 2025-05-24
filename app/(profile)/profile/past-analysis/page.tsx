import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreVertical } from "lucide-react";

export const metadata = {
  title: "Past Analysis",
  description: "Past Analysis",
};

const analysisData = [
  {
    date: "dd/mm/yyyy",
    hairScore: "84",
    diet: "Veg",
    product: "Item 1",
    status: "Active",
  },
  {
    date: "dd/mm/yyyy",
    hairScore: "84",
    diet: "Veg",
    product: "Item 1",
    status: "Active",
  },
  {
    date: "dd/mm/yyyy",
    hairScore: "84",
    diet: "Veg",
    product: "Item 1",
    status: "Active",
  },
  {
    date: "dd/mm/yyyy",
    hairScore: "84",
    diet: "Veg",
    product: "Item 1",
    status: "Active",
  },
  {
    date: "dd/mm/yyyy",
    hairScore: "84",
    diet: "Veg",
    product: "Item 1",
    status: "Active",
  },
  {
    date: "dd/mm/yyyy",
    hairScore: "84",
    diet: "Veg",
    product: "Item 1",
    status: "Active",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen px-5 md:px-12 pb-20 mt-2">
      <main className="container md:py-6">
        <div className="flex justify-between items-center flex-wrap w-full mb-5 md:mb-10 gap-4">
          <h1 className="text-3xl ">Past Analysis</h1>
          <div className="relative w-full md:w-[200px] bg-white">
            <Input
              type="date"
              placeholder="Search by Date"
              className="w-full md:w-[200px]"
            />
          </div>
          <div className="relative bg-white w-full md:w-[200px]">
            <Input
              type="search"
              placeholder="Search"
              className="w-full md:w-[200px]"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
          </div>
        </div>
        <div className="space-y-3">
          {/* Table Header */}
          <div className="bg-yellow  border rounded-[30px] px-6 py-4 grid grid-cols-4 md:grid-cols-6 gap-4 justify-items-center items-center">
            <div className="font-semibold">Date</div>
            <div className="font-semibold flex gap-2">
              <span className="hidden md:block">Hair</span> Score
            </div>
            <div className="font-semibold">Diet</div>
            <div className="font-semibold hidden md:block">Product</div>
            <div className="font-semibold hidden md:block">Status</div>
            <div className="font-semibold">Actions</div>
          </div>
          {analysisData.map((row, index) => (
            <div
              key={index}
              className="bg-white border rounded-[30px] pl-10 px-6 py-4 grid grid-cols-4 md:grid-cols-6 gap-4 justify-items-center items-center"
            >
              {/* Date Column */}
              <div className="col-span-1">{row.date}</div>

              {/* Hair Score Column */}
              <div className="col-span-1">{row.hairScore}</div>

              {/* Hide the following columns on small screens */}
              <div className="">{row.diet}</div>
              <div className="hidden md:block">{row.product}</div>
              <div className="hidden md:block text-green-600">{row.status}</div>

              {/* Action Button */}
              <div className="col-span-1 flex justify-end">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
