import SaleLayout from "@/components/sale/SaleLayout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SaleLayout>{children}</SaleLayout>;
}
