import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Toaster } from '@/components/ui/toaster';
import StudentUploadModule from '../components/StudentUploadModule';

// Mock the useToast hook
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

// Mock the lucide-react icons
vi.mock('lucide-react', () => ({
  Upload: () => <div data-testid="upload-icon" />,
  File: () => <div data-testid="file-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  XCircle: () => <div data-testid="x-circle-icon" />,
  Clock: () => <div data-testid="clock-icon" />
}));

describe('StudentUploadModule', () => {
  beforeEach(() => {
    // Mock the FileReader
    global.File = class MockFile {
      name: string;
      size: number;
      type: string;
      
      constructor(chunks: BlobPart[], filename: string, opts: FilePropertyBag = {}) {
        this.name = filename;
        this.size = chunks.reduce((acc, chunk) => acc + (typeof chunk === 'string' ? chunk.length : chunk.size), 0);
        this.type = opts.type || '';
      }
    } as any;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the upload form and submission history', () => {
    render(
      <>
        <StudentUploadModule userRole="student" />
        <Toaster />
      </>
    );

    // Check if the form elements are rendered
    expect(screen.getByText('Upload Assignment')).toBeInTheDocument();
    expect(screen.getByLabelText('Assignment Title *')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Faculty *')).toBeInTheDocument();
    expect(screen.getByLabelText('Upload File *')).toBeInTheDocument();
    expect(screen.getByText('Submit Assignment')).toBeInTheDocument();

    // Check if submission history is rendered
    expect(screen.getByText('Submission History')).toBeInTheDocument();
  });

  it('shows validation errors when required fields are missing', async () => {
    const toastMock = vi.fn();
    vi.mocked(toastMock).mockImplementation(toastMock);

    render(
      <>
        <StudentUploadModule userRole="student" />
        <Toaster />
      </>
    );

    const submitButton = screen.getByText('Submit Assignment');
    fireEvent.click(submitButton);

    // Wait for the toast to appear
    await waitFor(() => {
      expect(toastMock).toHaveBeenCalledWith({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
    });
  });

  it('handles file selection', () => {
    render(
      <>
        <StudentUploadModule userRole="student" />
        <Toaster />
      </>
    );

    const fileInput = screen.getByLabelText('Upload File *') as HTMLInputElement;
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });

    fireEvent.change(fileInput, {
      target: { files: [file] }
    });

    expect(fileInput.files).toHaveLength(1);
    expect(fileInput.files?.[0]).toBe(file);
  });

  it('renders submission history with mock data', () => {
    render(
      <>
        <StudentUploadModule userRole="student" />
        <Toaster />
      </>
    );

    // Check if mock submissions are displayed
    expect(screen.getByText('Mathematics Assignment 1')).toBeInTheDocument();
    expect(screen.getByText('Physics Lab Report')).toBeInTheDocument();
    
    // Check if status icons are rendered
    expect(screen.getAllByTestId('check-circle-icon')).toHaveLength(1); // Approved
    expect(screen.getAllByTestId('clock-icon')).toHaveLength(1); // Pending
  });

  it('formats file sizes correctly', () => {
    render(
      <>
        <StudentUploadModule userRole="student" />
        <Toaster />
      </>
    );

    // Check if file sizes are formatted correctly
    expect(screen.getByText('2.34 MB')).toBeInTheDocument(); // 2457600 bytes
    expect(screen.getByText('1.80 MB')).toBeInTheDocument(); // 1892352 bytes
  });
});