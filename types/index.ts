export interface FamilyMember {
  id: string;
  name: string;
  createdAt: string;
}

export interface Chore {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface Assignment {
  id: string;
  familyMemberId: string;
  familyMemberName: string;
  choreId: string | null; // null means day off
  choreName: string | null;
  date: string; // ISO date string (YYYY-MM-DD)
  isDayOff: boolean;
}

export interface DailyAssignments {
  date: string;
  assignments: Assignment[];
}
