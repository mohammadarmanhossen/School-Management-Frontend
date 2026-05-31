import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "BDT"): string {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  }).format(new Date(date));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToCSV<T extends object>(
  data: T[],
  filename: string,
  columns: { key: keyof T; label: string }[]
) {
  const headers = columns.map((c) => c.label).join(",");
  const rows = data
    .map((row) =>
      columns
        .map((c) => {
          const val = row[c.key];
          const str = String(val ?? "");
          return str.includes(",") ? `"${str}"` : str;
        })
        .join(",")
    )
    .join("\n");
  const csv = `${headers}\n${rows}`;
  downloadBlob(new Blob([csv], { type: "text/csv" }), filename);
}
