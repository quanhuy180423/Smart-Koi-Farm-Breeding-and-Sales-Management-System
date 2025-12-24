import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export const KoiFishSkeleton = () => (
  <Card className="overflow-hidden h-full flex flex-col">
    <div className="aspect-[4/3] relative">
      <Skeleton className="h-full w-full" />
    </div>
    <CardContent className="p-4 space-y-3 flex-1">
      <div className="flex justify-between">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
      <Skeleton className="h-8 w-1/3 mt-2" />
    </CardContent>
    <CardFooter className="p-4 pt-0">
      <Skeleton className="h-10 w-full rounded-md" />
    </CardFooter>
  </Card>
);

export const KoiGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
    {Array.from({ length: 6 }).map((_, i) => (
      <KoiFishSkeleton key={i} />
    ))}
  </div>
);
