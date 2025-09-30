import ManagerLayout from "@/components/manager/ManagerLayout";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ManagerLayout>{children}</ManagerLayout>;
}
