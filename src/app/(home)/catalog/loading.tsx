import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-8 shadow-xl">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
            <p className="text-xl font-semibold text-gray-800 animate-pulse">
              Đang tải danh mục cá Koi...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
