import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatTime(date: Date | string): string {
  const validDate = typeof date === "string" ? new Date(date) : date;

  if (isNaN(validDate.getTime())) {
    throw new Error("Invalid time value");
  }

  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(validDate);
}
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 20,
  }).format(amount);
}

export function formatAppointmentTime(
  startTime: string,
  endTime: string,
): string {
  const formatOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  };

  const start = new Date(startTime).toLocaleTimeString("en-US", formatOptions);
  const end = new Date(endTime).toLocaleTimeString("en-US", formatOptions);

  return `${start} - ${end}`;
}

export const isProduction = process.env.NODE_ENV === "production";

export const timeZone = "Asia/Kolkata";
