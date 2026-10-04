export type FamilyRole =
  | "OWNER"
  | "MEMBER"
  | "VIEWER";

export interface FamilyMember {
  id: string;

  familyId: string;

  userId: string;

  role: FamilyRole;

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date | null;
}