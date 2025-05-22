import { data } from "@/data/backup/data";
import { db } from "@/lib/db";
type tableTypes = keyof typeof data;
async function main() {
  try {
    const tables = Object.keys(data);
    const uploadSummary: Record<string, number> = {};

    for (const table of tables as tableTypes[]) {
      let dataToUpload = data[table].map((item: any) => {
        return {
          ...item,
          createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
          updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
        };
      });

      if (table === "user") {
        dataToUpload = data[table].map((user: any) => {
          return {
            ...user,
            email: user.email || null,
            phone: user.phone || null,
            password: user.password || "",
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            name: user.name || "",
            otp: null,
            emails: user.emails || [],
            createdAt: new Date(user.createdAt),
            updatedAt: new Date(user.updatedAt),
            otpExpires: new Date(),
            lastLogin: new Date(),
          };
        });
      }

      if (table === "timeSlot") {
        dataToUpload = data[table].map((item: any) => {
          return {
            ...item,
            date: new Date(item.date),
            startTime: new Date(item.startTime),
            endTime: new Date(item.endTime),
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          };
        });
      }

      if (table === "report") {
        dataToUpload = data[table].map((item: any) => {
          return {
            ...item,
            startTime: new Date(item.startTime),
            endTime: new Date(item.endTime),
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          };
        });
      }

      if (table === "userProgress") {
        dataToUpload = data[table].map((item: any) => {
          return {
            ...item,
            selectedDate: item.selectedDate
              ? new Date(item.selectedDate)
              : new Date(),
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          };
        });
      }

      const res = await (db[table] as any).createMany({
        data: dataToUpload,
        skipDuplicates: true,
      });

      uploadSummary[table] = res.count;
    }

    console.log("seeding completed", uploadSummary);
  } catch (error: unknown) {
    console.log("error while seeding", error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
