import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Upload, File, CheckCircle, XCircle, Clock } from "lucide-react";
import { uploadAssignment, getStudentUploads, getFaculties } from "@/services/uploadService";
import { Faculty, StudentUpload } from "@/types";

// Mock faculty data for testing
const MOCK_FACULTIES: Faculty[] = [
  { id: 'faculty1', email: 'smith@university.edu', full_name: 'Dr. Smith', role: 'faculty' },
  { id: 'faculty2', email: 'johnson@university.edu', full_name: 'Prof. Johnson', role: 'faculty' }
];

const StudentUploadModule = ({ userRole }: { userRole: string }) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [faculties, setFaculties] = useState<Faculty[]>(MOCK_FACULTIES); // Use mock data by default
  const [uploads, setUploads] = useState<StudentUpload[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load faculties and uploads on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Try to load faculties from the service
        const facultyList = await getFaculties();
        console.log("Faculty list loaded:", facultyList); // Debug log
        
        // If we get faculties from the service, use them; otherwise, keep mock data
        if (facultyList && facultyList.length > 0) {
          setFaculties(facultyList);
        }
        
        // Load student uploads
        const uploadList = await getStudentUploads();
        setUploads(uploadList);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !title || !selectedFaculty) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Upload the assignment
      const result = await uploadAssignment({
        title,
        description,
        facultyId: selectedFaculty,
        file
      });

      if (result) {
        // Add new upload to the list
        setUploads([result, ...uploads]);
        
        // Reset form
        setFile(null);
        setTitle("");
        setDescription("");
        setSelectedFaculty("");
        
        toast({
          title: "Upload Successful",
          description: "Your file has been uploaded successfully and sent to the selected faculty member.",
        });
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "submitted":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "submitted":
        return "Pending Review";
      case "pending":
        return "Pending Review";
      default:
        return "Submitted";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
        <p className="text-muted-foreground mt-1">Upload your assignments and track their status</p>
      </div>
      
      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Assignment</CardTitle>
          <CardDescription>Submit your assignments to faculty members</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Assignment Title *</Label>
              <Input
                id="title"
                placeholder="Enter assignment title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="faculty">Select Faculty *</Label>
              <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select faculty member" />
                </SelectTrigger>
                <SelectContent>
                  {faculties.map((faculty) => (
                    <SelectItem key={faculty.id} value={faculty.id}>
                      {faculty.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {faculties.length === 0 && (
                <p className="text-sm text-muted-foreground">No faculty members available. Please contact administrator.</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Add any additional notes or instructions"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="file">Upload File *</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  className="flex-1"
                  required
                />
                {file && (
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <File className="h-4 w-4" />
                    <span>{file.name}</span>
                  </div>
                )}
              </div>
            </div>
            
            <Button type="submit" disabled={isUploading} className="w-full">
              {isUploading ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Submit Assignment
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Upload History */}
      <Card>
        <CardHeader>
          <CardTitle>Submission History</CardTitle>
          <CardDescription>Your uploaded assignments and their status</CardDescription>
        </CardHeader>
        <CardContent>
          {uploads.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <File className="mx-auto h-12 w-12" />
              <p className="mt-2">No submissions yet</p>
              <p className="text-sm">Upload your first assignment to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {uploads.map((upload) => {
                const faculty = faculties.find(f => f.id === upload.faculty_id);
                return (
                  <div key={upload.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-muted rounded-full">
                        <File className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium">{upload.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {upload.original_filename} • {formatFileSize(upload.file_path.length)}
                        </p>
                        {faculty && (
                          <p className="text-xs text-muted-foreground">
                            Submitted to: {faculty.full_name}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Submitted: {new Date(upload.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(upload.status)}
                        <span className="text-sm">{getStatusText(upload.status)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentUploadModule;