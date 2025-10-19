import SaleLayout from "@/components/sale/SaleLayout";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const role = cookieStore.get?.("user-role")?.value ?? "guest";
  if (role !== "sale-staff") {
    redirect("/login");
  }

  return <SaleLayout>{children}</SaleLayout>;
}
