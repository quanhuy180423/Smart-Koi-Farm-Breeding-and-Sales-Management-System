import ManagerLayout from "@/components/manager/ManagerLayout";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const role = cookieStore.get?.("user-role")?.value ?? "guest";
  if (role !== "manager" && role !== "farm-staff") {
    redirect("/login");
  }

  return <ManagerLayout>{children}</ManagerLayout>;
}
