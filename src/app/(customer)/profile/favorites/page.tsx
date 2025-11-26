"use client";

import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import CustomerLayout from "@/components/customer/CustomerLayout";
import { EmptyState } from "@/components/common/EmptyState";
import { useGetKoiFishes } from "@/hooks/useKoiFish";
import { PaginationWithLinks } from "@/components/pagination";
import { KoiFishCard } from "@/app/(home)/catalog/components/KoiFishCard";
import { useRemoveFavorite } from "@/hooks/useFavoriteKoi";
import { useQueryClient } from "@tanstack/react-query";

const PAGE_SIZE = 9;

export default function FavoritesPage() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data: favoriteKoiData, isLoading } = useGetKoiFishes({
    pageIndex: page,
    pageSize: PAGE_SIZE,
    IsFavorited: true,
  });

  const { mutate: removeFavorite, isPending: isRemoving } = useRemoveFavorite();

  const handleRemoveFavorite = (koiId: number) => {
    removeFavorite(koiId, {
      onSuccess: () => {
        // Invalidate and refetch the favorites query
        queryClient.invalidateQueries({
          queryKey: ["koi-fishes"],
        });
      },
    });
  };

  const favoriteKoi = favoriteKoiData?.data || [];
  const totalPages = favoriteKoiData?.totalPages || 1;
  const totalItems = favoriteKoiData?.totalItems || 0;

  if (isLoading) {
    return (
      <CustomerLayout>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">
                Đang tải danh sách yêu thích...
              </p>
            </div>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Cá Koi yêu thích</h1>
            <p className="text-muted-foreground">
              Danh sách các con cá Koi bạn quan tâm ({totalItems} con)
            </p>
          </div>
        </div>

        {favoriteKoi.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Chưa có cá Koi yêu thích"
            description="Khám phá bộ sưu tập và thêm những con cá Koi bạn yêu thích"
            action={{
              label: "Khám phá ngay",
              onClick: () => (window.location.href = "/catalog"),
            }}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteKoi.map((koi) => {
                return (
                  <KoiFishCard
                    key={koi.id}
                    koi={koi}
                    showAddToCartButton={false}
                    showRemoveFavoriteButton={true}
                    onRemoveFavorite={handleRemoveFavorite}
                    removing={isRemoving}
                  />
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <PaginationWithLinks
                  page={page}
                  pageSize={PAGE_SIZE}
                  totalCount={totalItems}
                  onPageChange={(newPage) => setPage(newPage)}
                />
              </div>
            )}
          </>
        )}
      </div>
    </CustomerLayout>
  );
}
