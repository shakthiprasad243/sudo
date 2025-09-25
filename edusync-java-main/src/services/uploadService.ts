import { supabase } from '../lib/supabaseClient';
import { StudentUpload, Faculty, EnrichedUpload, SubmissionStatus } from '../types';

export interface UploadData {
  title?: string;
  description?: string;
  facultyId: string;
  file: File;
}

// In-memory storage for mock uploads
let mockUploads: StudentUpload[] = [
  {
    id: 1,
    student_id: 'mock_student_id',
    faculty_id: 'faculty1',
    title: 'Sample Assignment',
    description: 'This is a sample assignment submission',
    file_path: 'mock_uploads/sample.pdf',
    original_filename: 'sample.pdf',
    status: SubmissionStatus.SUBMITTED,
    created_at: new Date().toISOString()
  }
];

/**
 * Upload a file and create a student upload record
 * @param uploadData - The upload data including file and metadata
 * @returns The created upload record
 */
export const uploadAssignment = async (uploadData: UploadData): Promise<StudentUpload | null> => {
  console.log("Starting uploadAssignment with data:", uploadData);
  
  try {
    // Get current user ID - simplified for testing
    const userId = 'mock_student_id'; // Using a mock user ID for testing
    console.log("Using mock user ID:", userId);

    // Create a mock file path since we're not actually uploading to storage
    const mockFilePath = `mock_uploads/${Date.now()}_${Math.random().toString(36).substring(2)}_${uploadData.file.name}`;
    console.log("Generated mock file path:", mockFilePath);

    // Create a mock upload record
    const mockUpload: StudentUpload = {
      id: Date.now(), // Simple ID generation for mock
      student_id: userId,
      faculty_id: uploadData.facultyId,
      title: uploadData.title || 'Untitled Assignment',
      description: uploadData.description || '',
      file_path: mockFilePath,
      original_filename: uploadData.file.name,
      status: SubmissionStatus.SUBMITTED,
      created_at: new Date().toISOString()
    };
    
    // Store the mock upload
    mockUploads.push(mockUpload);
    console.log("Created and stored mock upload record:", mockUpload);
    return mockUpload;
  } catch (error) {
    console.error('Error in uploadAssignment:', error);
    return null;
  }
};

/**
 * Get all uploads for the current student
 * @returns Array of student uploads
 */
export const getStudentUploads = async (): Promise<StudentUpload[]> => {
  console.log("Fetching student uploads");
  
  try {
    // Return mock data for demonstration
    const studentUploads = mockUploads.filter(upload => upload.student_id === 'mock_student_id');
    console.log("Returning mock student uploads:", studentUploads);
    return studentUploads;
  } catch (error) {
    console.error('Error fetching student uploads:', error);
    return [];
  }
};

/**
 * Get all uploads for a specific faculty member
 * @returns Array of student uploads assigned to the faculty
 */
export const getFacultyUploads = async (): Promise<EnrichedUpload[]> => {
  console.log("Fetching faculty uploads");
  
  try {
    // Return mock data for demonstration
    const facultyUploads = mockUploads.filter(upload => upload.faculty_id === 'faculty1');
    
    // Convert to enriched uploads
    const enrichedUploads: EnrichedUpload[] = facultyUploads.map(upload => ({
      ...upload,
      student: {
        full_name: 'John Student',
        email: 'john@student.edu'
      },
      faculty: {
        full_name: 'Dr. Smith',
        email: 'smith@university.edu'
      }
    }));
    
    console.log("Returning mock faculty uploads:", enrichedUploads);
    return enrichedUploads;
  } catch (error) {
    console.error('Error fetching faculty uploads:', error);
    return [];
  }
};

/**
 * Update the status of an upload (faculty only)
 * @param uploadId - The ID of the upload to update
 * @param status - The new status
 * @returns The updated upload record
 */
export const updateUploadStatus = async (uploadId: number, status: string): Promise<StudentUpload | null> => {
  console.log("Updating upload status for ID:", uploadId, "to status:", status);
  
  try {
    // Find and update the mock upload
    const uploadIndex = mockUploads.findIndex(u => u.id === uploadId);
    if (uploadIndex === -1) {
      console.error('Upload not found with ID:', uploadId);
      return null;
    }
    
    const updatedUpload = {
      ...mockUploads[uploadIndex],
      status: status as SubmissionStatus,
      updated_at: new Date().toISOString()
    };
    
    mockUploads[uploadIndex] = updatedUpload;
    console.log("Updated upload:", updatedUpload);
    return updatedUpload;
  } catch (error) {
    console.error('Error updating upload status:', error);
    return null;
  }
};

/**
 * Get all faculty members
 * @returns Array of faculty members
 */
export const getFaculties = async (): Promise<Faculty[]> => {
  console.log("Fetching faculties");
  
  try {
    // Return mock faculty data
    const mockFaculties: Faculty[] = [
      { id: 'faculty1', email: 'smith@university.edu', full_name: 'Dr. Smith', role: 'faculty' },
      { id: 'faculty2', email: 'johnson@university.edu', full_name: 'Prof. Johnson', role: 'faculty' }
    ];
    
    console.log("Returning mock faculties:", mockFaculties);
    return mockFaculties;
  } catch (error) {
    console.error('Error fetching faculties:', error);
    // Return mock faculty data as fallback
    return [
      { id: 'faculty1', email: 'smith@university.edu', full_name: 'Dr. Smith', role: 'faculty' },
      { id: 'faculty2', email: 'johnson@university.edu', full_name: 'Prof. Johnson', role: 'faculty' }
    ];
  }
};

/**
 * Download an assignment file
 * @param filePath - The path to the file in storage
 * @returns The file as a blob
 */
export const downloadAssignment = async (filePath: string): Promise<Blob | null> => {
  console.log("Downloading assignment from path:", filePath);
  
  try {
    // Since we're not actually storing files, we'll create a mock blob
    const content = `This is a mock file for: ${filePath}`;
    const blob = new Blob([content], { type: 'text/plain' });
    return blob;
  } catch (error) {
    console.error('Error downloading assignment:', error);
    return null;
  }
};