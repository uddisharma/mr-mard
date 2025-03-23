import DatePicker from "@/components/others/date-picker";
import { currentUser } from "@/lib/auth";

export default async function DateSelectionPage() {
  const session = await currentUser();
  return <DatePicker id={session?.id} />;
}
