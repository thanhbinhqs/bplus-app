/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRef, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
  RowSelectionState,
} from "@tanstack/react-table";
import { cn } from "~/lib/utils";

export default function AppTable({ columns, data }: any) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const tableRef = useRef<HTMLTableElement>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const calculateColumnWidth = (columnId: string) => {
    if (!tableRef.current) return 0;
    const header = tableRef.current.querySelector(
      `th[data-column-id="${columnId}"]`
    );
    const cells = tableRef.current.querySelectorAll(
      `td[data-column-id="${columnId}"]`
    );

    const measureTextWidth = (text: string) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) return 0;
      context.font = "16px sans-serif"; // Match table font
      return context.measureText(text).width + 32; // Add padding
    };

    let maxWidth = header ? measureTextWidth(header.textContent || "") : 0;
    cells.forEach((cell: { textContent: any }) => {
      const width = measureTextWidth(cell.textContent || "");
      maxWidth = Math.max(maxWidth, width);
    });

    return Math.min(Math.max(maxWidth, 50), 400); // Respect min/max sizes
  };

  const table = useReactTable({
    data,
    columns,
    state: { sorting, rowSelection },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    columnResizeDirection: "ltr",
    enableRowSelection: true,
  });

  const handleDoubleClick = (columnId: string) => {
    const newWidth = calculateColumnWidth(columnId);
    table.setColumnSizing((prev) => ({
      ...prev,
      [columnId]: newWidth,
    }));
  };

  return (
    <div className="overflow-x-auto max-w-full">
      <div className="relative overflow-auto max-h-[calc(100vh-48px)] w-full scrollbar-left">
        {/* <style>
          {`
            .scrollbar-left {
              direction: rtl;
              overflow-y: auto;
            }
            .scrollbar-left table {
              direction: ltr;
            }
          `}
        </style> */}
        <table
          id="app-table"
          ref={tableRef}
          className="w-full border-collapse table-fixed"
        >
          <thead className="sticky top-0 bg-gray-100 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const align = header.column.columnDef.meta?.align || "left";
                  return (
                    <th
                      key={header.id}
                      data-column-id={header.id}
                      className="px-4 py-2 font-medium text-gray-800 border-b relative"
                      style={{
                        width: header.getSize(),
                        minWidth: header.column.columnDef.minSize || 50,
                        maxWidth: header.column.columnDef.maxSize || 400,
                      }}
                    >
                      <div
                        className="flex items-center cursor-pointer select-none"
                        style={{
                          justifyContent:
                            align === "center"
                              ? "center"
                              : align === "right"
                              ? "flex-end"
                              : "flex-start",
                        }}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                      {header.column.getCanResize() && (
                        <div
                          onMouseDown={(e) => {
                            e.preventDefault();
                            header.getResizeHandler()(e);
                          }}
                          onTouchStart={(e) => {
                            e.preventDefault();
                            header.getResizeHandler()(e);
                          }}
                          onDoubleClick={() => handleDoubleClick(header.id)}
                          className={`absolute right-0 top-0 h-full w-[5px] bg-gray-100 cursor-col-resize hover:w-[8px] hover:bg-blue-500 ${
                            header.column.getIsResizing() ? "bg-blue-500" : ""
                          }`}
                        />
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-blue-100">
                {row.getVisibleCells().map((cell) => {
                  const align = cell.column.columnDef.meta?.align || "left";

                  return (
                    <td
                      key={cell.id}
                      data-column-id={cell.column.id}
                      className={cn(
                        "px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis"
                      )}
                      style={{
                        width: cell.column.getSize(),
                        minWidth: cell.column.columnDef.minSize || 50,
                        maxWidth: cell.column.columnDef.maxSize || 400,
                        textAlign: align,
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
