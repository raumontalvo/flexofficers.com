"use client";

import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { cn } from "@/lib/cn";

function buildPageNumbers(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage]);

  if (currentPage > 1) pages.add(currentPage - 1);
  if (currentPage < totalPages) pages.add(currentPage + 1);

  return [...pages].sort((a, b) => a - b);
}

type BrowseListPaginationProps = {
  currentPage: number;
  totalPages: number;
  label: string;
  onPageChange: (page: number) => void;
  className?: string;
};

export function BrowseListPagination({
  currentPage,
  totalPages,
  label,
  onPageChange,
  className,
}: BrowseListPaginationProps) {
  const { t } = useLandingLanguage();
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const pageNumbers = buildPageNumbers(safePage, totalPages);

  if (totalPages <= 1) {
    return label ? <p className={cn("px-0.5 text-xs text-fo-text-muted", className)}>{label}</p> : null;
  }

  return (
    <div
      className={cn(
        "fo-glass-card flex flex-col gap-3 rounded-lg border border-white/10 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <p className="text-xs text-fo-text-muted">{label}</p>

      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(safePage - 1)}
          disabled={safePage <= 1}
          className={cn(
            "rounded-md border border-fo-border px-2.5 py-1 text-xs font-medium text-fo-text-muted transition",
            safePage > 1 && "hover:border-fo-border-strong hover:text-fo-text",
            safePage <= 1 && "cursor-not-allowed opacity-40"
          )}
        >
          {t.browse.pagination.previous}
        </button>

        {pageNumbers.map((page, index) => {
          const prev = pageNumbers[index - 1];
          const showEllipsis = prev !== undefined && page - prev > 1;

          return (
            <span key={page} className="flex items-center gap-1.5">
              {showEllipsis ? (
                <span className="px-1 text-xs text-fo-text-subtle">…</span>
              ) : null}
              <button
                type="button"
                onClick={() => onPageChange(page)}
                className={cn(
                  "min-w-8 rounded-md border px-2 py-1 text-xs font-medium transition",
                  page === safePage
                    ? "border-fo-primary-bright bg-fo-primary/15 text-fo-primary-bright"
                    : "border-fo-border text-fo-text-muted hover:border-fo-border-strong hover:text-fo-text"
                )}
              >
                {page}
              </button>
            </span>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(safePage + 1)}
          disabled={safePage >= totalPages}
          className={cn(
            "rounded-md border border-fo-border px-2.5 py-1 text-xs font-medium text-fo-text-muted transition",
            safePage < totalPages &&
              "hover:border-fo-border-strong hover:text-fo-text",
            safePage >= totalPages && "cursor-not-allowed opacity-40"
          )}
        >
          {t.browse.pagination.next}
        </button>
      </div>
    </div>
  );
}
