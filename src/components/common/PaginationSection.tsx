import * as React from "react";
import { MoreHorizontal } from "lucide-react";

// Utility Functions
type ComponentProps<
  T extends
    | keyof React.JSX.IntrinsicElements
    | React.JSXElementConstructor<unknown>,
> =
  T extends React.JSXElementConstructor<infer Props>
    ? Props
    : T extends keyof React.JSX.IntrinsicElements
      ? React.JSX.IntrinsicElements[T]
      : Record<string, unknown>;

const cn = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(" ");

const buttonVariants = ({
  variant,
  size,
}: {
  variant?: string;
  size?: string;
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    icon: "h-10 w-10",
  };

  return cn(
    baseStyles,
    variant ? variants[variant as keyof typeof variants] : variants.ghost,
    size ? sizes[size as keyof typeof sizes] : sizes.default,
  );
};

const Pagination = ({ className, ...props }: ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<HTMLLIElement, ComponentProps<"li">>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("cursor-pointer", className)} {...props} />
  ),
);
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
  size?: "default" | "icon";
} & ComponentProps<"a">;

const PaginationLink = React.forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  ({ className, isActive, size = "icon", ...props }, ref) => (
    <a
      ref={ref}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? "default" : "ghost",
          size,
        }),
        className,
      )}
      {...props}
    />
  ),
);
PaginationLink.displayName = "PaginationLink";

const PaginationFirst = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Trang đầu"
    size="icon"
    className={cn("gap-1", className)}
    {...props}
  >
    <span className="text-lg font-semibold">{"<<"}</span>
  </PaginationLink>
);
PaginationFirst.displayName = "PaginationFirst";

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Trang trước"
    size="icon"
    className={cn("gap-1", className)}
    {...props}
  >
    <span className="text-lg font-semibold">{"<"}</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Trang sau"
    size="icon"
    className={cn("gap-1", className)}
    {...props}
  >
    <span className="text-lg font-semibold">{">"}</span>
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationLast = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Trang cuối"
    size="icon"
    className={cn("gap-1", className)}
    {...props}
  >
    <span className="text-lg font-semibold">{">>"}</span>
  </PaginationLink>
);
PaginationLast.displayName = "PaginationLast";

const PaginationEllipsis = ({
  className,
  ...props
}: ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

type TPaginationSectionProps = {
  totalPosts?: number;
  postsPerPage?: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages?: number;
  setPageSize?: (size: number) => void;
  pageSizeOptions?: number[];
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
};

const PaginationSection = ({
  totalPosts,
  postsPerPage,
  currentPage,
  setCurrentPage,
  totalPages,
  setPageSize,
  pageSizeOptions = [10, 20, 50, 100],
  hasNextPage = false,
  hasPreviousPage = false,
}: TPaginationSectionProps) => {
  const pageCount =
    totalPages ??
    (totalPosts && postsPerPage ? Math.ceil(totalPosts / postsPerPage) : 1);

  const pageNumbers = Array.from({ length: pageCount }, (_, i) => i + 1);

  const maxPageNum = 2;
  const pageNumLimit = Math.floor(maxPageNum / 2);

  const activePages = pageNumbers.slice(
    Math.max(0, currentPage - 1 - pageNumLimit),
    Math.min(currentPage - 1 + pageNumLimit + 1, pageNumbers.length),
  );

  const handleNextPage = () =>
    currentPage < pageNumbers.length && setCurrentPage(currentPage + 1);
  const handlePrevPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleFirstPage = () => currentPage > 1 && setCurrentPage(1);
  const handleLastPage = () =>
    currentPage < pageNumbers.length && setCurrentPage(pageNumbers.length);

  const renderPages = () => {
    const renderedPages = activePages.map((page) => (
      <PaginationItem key={page}>
        <PaginationLink
          isActive={currentPage === page}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </PaginationLink>
      </PaginationItem>
    ));

    if (activePages[0] > 1) {
      renderedPages.unshift(
        <PaginationEllipsis
          key="ellipsis-start"
          onClick={() => setCurrentPage(activePages[0] - 1)}
        />,
      );
    }

    if (activePages[activePages.length - 1] < pageNumbers.length) {
      renderedPages.push(
        <PaginationEllipsis
          key="ellipsis-end"
          onClick={() =>
            setCurrentPage(activePages[activePages.length - 1] + 1)
          }
        />,
      );
    }

    return renderedPages;
  };

  return (
    <div className="flex flex-col gap-2 p-4 md:flex-row md:items-center md:justify-between">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationFirst
              onClick={handleFirstPage}
              aria-disabled={!hasPreviousPage}
              className={cn(
                !hasPreviousPage && "pointer-events-none opacity-50",
              )}
            />
            <PaginationPrevious
              onClick={handlePrevPage}
              aria-disabled={!hasPreviousPage}
              className={cn(
                !hasPreviousPage && "pointer-events-none opacity-50",
              )}
            />
          </PaginationItem>

          {renderPages()}

          <PaginationItem>
            <PaginationNext
              onClick={handleNextPage}
              aria-disabled={!hasNextPage}
              className={cn(!hasNextPage && "pointer-events-none opacity-50")}
            />
            <PaginationLast
              onClick={handleLastPage}
              aria-disabled={!hasNextPage}
              className={cn(!hasNextPage && "pointer-events-none opacity-50")}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {setPageSize && (
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <span className="text-sm whitespace-nowrap">Hiển thị:</span>
          <select
            className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            onChange={(e) => setPageSize(Number(e.target.value))}
            defaultValue={postsPerPage || 10}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationFirst,
  PaginationPrevious,
  PaginationNext,
  PaginationLast,
  PaginationEllipsis,
  PaginationSection,
};
