import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Upload, File } from "lucide-react";
import { uploadAssignment, getFaculties } from "@/services/uploadService";
import { Faculty } from "@/types";

const UploadTest = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

  // Load faculties on component mount
  useEffect(() => {
    const loadFaculties = async () => {
      try {
        const facultyList = await getFaculties();
        setFaculties(facultyList);
        console.log("Loaded faculties:", facultyList);
      } catch (error) {
        console.error("Error loading faculties:", error);
      }
    };

    loadFaculties();
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
    setUploadResult(null);
    
    try {
      console.log("Starting upload with data:", {
        title,
        description,
        facultyId: selectedFaculty,
        file
      });
      
      // Upload the assignment
      const result = await uploadAssignment({
        title,
        description,
        facultyId: selectedFaculty,
        file
      });

      console.log("Upload result:", result);
      setUploadResult(result);
      
      if (result) {
        toast({
          title: "Upload Successful",
          description: "Your file has been uploaded successfully.",
        });
      } else {
        throw new Error("Upload returned null result");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Test</CardTitle>
          <CardDescription>Test the upload functionality</CardDescription>
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
                  Test Upload
                </>
              )}
            </Button>
          </form>
          
          {uploadResult && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Upload Result:</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(uploadResult, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadTest;