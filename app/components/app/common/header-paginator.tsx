import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../ui/pagination";

interface PaginationProps {
  total: number;
  page: number;
  limit: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

export function PaginationComponent({
  total,
  page,
  limit,
  className,
}: PaginationProps) {
  const totalPages = Math.ceil(total / limit);
  const [visiblePageCount, setVisiblePageCount] = useState(7); // Trang hiện tại + 2 trang trước + 2 trang sau

  useEffect(() => {
    //windows resize event
    const handleResize = () => {
      if (window.innerWidth <= 640) {
        setVisiblePageCount(0);
      } else {
        setVisiblePageCount(7);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getPageItems = () => {
    const items: React.ReactNode[] = [];
    if (totalPages <= 1) return items;

    if (totalPages <= 1 || visiblePageCount <= 0) {
      return null;
    }

    if (totalPages <= visiblePageCount) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href={`?page=${i}&limit=${limit}`}
              className={i == page ? "bg-primary text-primary-foreground" : ""}
              isActive={i == page}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      return items;
    }

    if (page <= 3) {
      for (let i = 1; i < 6; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href={`?page=${i}&limit=${limit}`}
              className={i == page ? "bg-primary text-primary-foreground" : ""}
              isActive={i == page}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      //add ellipsis
      items.push(
        <PaginationItem key="ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );

      //add last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href={`?page=${totalPages}&limit=${limit}`}
            className={
              totalPages == page ? "bg-primary text-primary-foreground" : ""
            }
            isActive={totalPages == page}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );

      return items;
    }

    if (page >= 4 && page < totalPages - 4) {
      //add first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href={`?page=${1}&limit=${limit}`}
            className={1 == page ? "bg-primary text-primary-foreground" : ""}
            isActive={1 == page}
          >
            {1}
          </PaginationLink>
        </PaginationItem>
      );

      //add ellipsis
      items.push(
        <PaginationItem key="ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );

      //add current page and 2 pages before and after
      for (let i = Number(page) - 1; i <= Number(page) + 1; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href={`?page=${i}&limit=${limit}`}
              className={i == page ? "bg-primary text-primary-foreground" : ""}
              isActive={i == page}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      //add ellipsis
      items.push(
        <PaginationItem key="ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );

      //add last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href={`?page=${totalPages}&limit=${limit}`}
            className={
              totalPages == page ? "bg-primary text-primary-foreground" : ""
            }
            isActive={totalPages == page}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );

      return items;
    }

    if (page >= totalPages - 4) {
      //add first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href={`?page=${1}&limit=${limit}`}
            className={1 == page ? "bg-primary text-primary-foreground" : ""}
            isActive={1 == page}
          >
            {1}
          </PaginationLink>
        </PaginationItem>
      );

      //add ellipsis
      items.push(
        <PaginationItem key="ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );

      for (let i = totalPages - 4; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href={`?page=${i}&limit=${limit}`}
              className={i == page ? "bg-primary text-primary-foreground" : ""}
              isActive={i == page}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      return items;
    }

    return [];
  };

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`?page=${Number(page) - 1}&limit=${limit}`}
            className={page <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {getPageItems()}

        <PaginationItem>
          <PaginationNext
            href={`?page=${Number(page) + 1}&limit=${limit}`}
            className={
              page >= totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
