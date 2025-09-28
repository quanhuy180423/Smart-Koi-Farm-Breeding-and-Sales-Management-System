import { LoadingSection } from "@/components/ui/loading";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <LoadingSection
        text="Đang tải lịch sử đơn hàng..."
        size={80}
        color="#0A3D62"
      />
    </div>
  );
}
