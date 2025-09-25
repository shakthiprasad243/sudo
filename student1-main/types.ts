export enum UserRole {
  STUDENT = 'student',
  ADMIN = 'admin',
}

export enum SubmissionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CHANGES_REQUESTED = 'changes_requested',
}

export interface User {
  id: string; // Comes from Supabase auth
  name: string;
  email: string;
  role: UserRole;
  updated_at?: string;
}

export interface Submission {
  id: string;
  student_id: string;
  file_name: string;
  file_path: string | null;
  file_size: number | null;
  file_type: string | null;
  status: SubmissionStatus;
  rejection_reason: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at?: string;
  expires_at: string | null;
}

// A client-side-only type for combining submission data with student details.
export type EnrichedSubmission = Submission & { studentName: string };