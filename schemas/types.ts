import { UserRole } from "@prisma/client";

export type ExportType =
  | "blog"
  | "question"
  | "contact"
  | "report"
  | "user"
  | "newsletter"
  | "leads"
  | "appointment"
  | "cancelled";

export interface User {
  id: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  email: string | null;
  image: string | null;
  location: string | null;
  createdAt: string | null;
  role: UserRole | null;
}

export interface permissions {
  role: string;
  resource: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}
