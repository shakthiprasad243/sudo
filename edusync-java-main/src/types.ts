export enum UserRole {
  STUDENT = 'student',
  FACULTY = 'faculty',
  ADMIN = 'admin',
  HOD = 'hod',
  GOVT = 'govt'
}

export enum SubmissionStatus {
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PENDING = 'pending'
}

export interface User {
  id: string; // Comes from Supabase auth
  full_name: string;
  email: string;
  role: UserRole;
  updated_at?: string;
}

export interface StudentUpload {
  id: number;
  student_id: string;
  faculty_id: string;
  title: string;
  description: string;
  file_path: string;
  original_filename: string;
  status: SubmissionStatus;
  created_at: string;
  updated_at?: string;
}

export interface Faculty {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

// A client-side-only type for combining upload data with student details.
export type EnrichedUpload = StudentUpload & { 
  student: {
    full_name: string;
    email: string;
  };
  faculty: {
    full_name: string;
    email: string;
  };
};