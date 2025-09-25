import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, XCircle, Clock, File, Search } from "lucide-react";
import { getFacultyUploads, updateUploadStatus } from "@/services/uploadService";
import { EnrichedUpload } from "@/types";

const FacultyDashboardModule = ({ userRole }: { userRole: string }) => {
  const { toast } = useToast();
  const [uploads, setUploads] = useState<EnrichedUpload[]>([]);
  const [filteredUploads, setFilteredUploads] = useState<EnrichedUpload[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Load uploads on component mount
  useEffect(() => {
    const loadUploads = async () => {
      setIsLoading(true);
      try {
        const uploadList = await getFacultyUploads();
        setUploads(uploadList);
        setFilteredUploads(uploadList);
      } catch (error) {
        console.error("Error loading uploads:", error);
        toast({
          title: "Error",
          description: "Failed to load submissions. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUploads();
  }, []);

  // Filter uploads based on search term and status
  useEffect(() => {
    let result = uploads;
    
    if (searchTerm) {
      result = result.filter(upload => 
        upload.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        upload.student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        upload.original_filename.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      result = result.filter(upload => upload.status === statusFilter);
    }
    
    setFilteredUploads(result);
  }, [searchTerm, statusFilter, uploads]);

  const handleApprove = async (id: number) => {
    try {
      const updatedUpload = await updateUploadStatus(id, "approved");
      if (updatedUpload) {
        setUploads(uploads.map(upload => 
          upload.id === id ? { ...upload, status: "approved" } as EnrichedUpload : upload
        ));
        toast({
          title: "Assignment Approved",
          description: "The assignment has been marked as approved."
        });
      }
    } catch (error) {
      console.error("Error approving assignment:", error);
      toast({
        title: "Error",
        description: "Failed to approve the assignment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleReject = async (id: number) => {
    try {
      const updatedUpload = await updateUploadStatus(id, "rejected");
      if (updatedUpload) {
        setUploads(uploads.map(upload => 
          upload.id === id ? { ...upload, status: "rejected" } as EnrichedUpload : upload
        ));
        toast({
          title: "Assignment Rejected",
          description: "The assignment has been marked as rejected."
        });
      }
    } catch (error) {
      console.error("Error rejecting assignment:", error);
      toast({
        title: "Error",
        description: "Failed to reject the assignment. Please try again.",
        variant: "destructive"
      });
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
        <h1 className="text-3xl font-bold text-foreground">Faculty Dashboard</h1>
        <p className="text-muted-foreground mt-1">Review and manage student submissions</p>
      </div>
      
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by student name, title, or file name"
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Filter by Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="submitted">Pending Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Uploads List */}
      <Card>
        <CardHeader>
          <CardTitle>Student Submissions</CardTitle>
          <CardDescription>Review assignments submitted by your students</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredUploads.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <File className="mx-auto h-12 w-12" />
              <p className="mt-2">No submissions found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUploads.map((upload) => (
                <div key={upload.id} className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-muted rounded-full">
                        <File className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{upload.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Submitted by {upload.student.full_name} ({upload.student.email})
                        </p>
                        <p className="text-sm">{upload.original_filename} • {formatFileSize(upload.file_path.length)}</p>
                        <p className="text-xs text-muted-foreground">
                          Submitted: {new Date(upload.created_at).toLocaleDateString()}
                        </p>
                        {upload.description && (
                          <p className="text-sm mt-2 text-muted-foreground">
                            {upload.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(upload.status)}
                        <span className="text-sm">{getStatusText(upload.status)}</span>
                      </div>
                      
                      {upload.status === "submitted" && (
                        <div className="flex space-x-2 mt-2 sm:mt-0">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleReject(upload.id)}
                          >
                            Reject
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => handleApprove(upload.id)}
                          >
                            Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FacultyDashboardModule;