import ManagerLayout from "@/components/manager/ManagerLayout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ManagerLayout>{children}</ManagerLayout>;
}
