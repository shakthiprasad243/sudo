import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  BookOpen, 
  Settings, 
  Download,
  Upload,
  Play,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  FileText,
  Table
} from "lucide-react";

interface TimetableModuleProps {
  userRole: "admin" | "hod" | "faculty" | "student" | "govt";
}

const TimetableModule = ({ userRole }: TimetableModuleProps) => {
  const [activeTab, setActiveTab] = useState("view");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateTimetable = async () => {
    setIsGenerating(true);
    // Simulate constraint solver processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsGenerating(false);
  };

  const mockTimetableData = {
    "Monday": [
      { time: "09:00-10:00", subject: "Data Structures", faculty: "Dr. Smith", room: "CS-101", batch: "CS-3A" },
      { time: "10:00-11:00", subject: "Algorithms", faculty: "Prof. Johnson", room: "CS-102", batch: "CS-3A" },
      { time: "11:30-12:30", subject: "Database Systems", faculty: "Dr. Williams", room: "CS-Lab1", batch: "CS-3B" },
      { time: "14:00-15:00", subject: "Software Engineering", faculty: "Prof. Brown", room: "CS-103", batch: "CS-4A" },
    ],
    "Tuesday": [
      { time: "09:00-10:00", subject: "Machine Learning", faculty: "Dr. Davis", room: "CS-104", batch: "CS-4A" },
      { time: "10:00-11:00", subject: "Computer Networks", faculty: "Prof. Miller", room: "CS-105", batch: "CS-3A" },
      { time: "11:30-12:30", subject: "Web Development", faculty: "Dr. Wilson", room: "CS-Lab2", batch: "CS-3B" },
      { time: "14:00-15:00", subject: "Mobile Computing", faculty: "Prof. Garcia", room: "CS-106", batch: "CS-4B" },
    ],
    "Wednesday": [
      { time: "09:00-10:00", subject: "Operating Systems", faculty: "Dr. Martinez", room: "CS-107", batch: "CS-3A" },
      { time: "10:00-11:00", subject: "Computer Graphics", faculty: "Prof. Anderson", room: "Graphics-Lab", batch: "CS-4A" },
      { time: "11:30-12:30", subject: "Compiler Design", faculty: "Dr. Taylor", room: "CS-108", batch: "CS-4B" },
    ],
  };

  const canManageTimetable = userRole === "admin" || userRole === "hod";

  if (!canManageTimetable && userRole !== "faculty" && userRole !== "student") {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
            <p className="text-muted-foreground">Timetable access not available for your role.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Timetable Management</h2>
          <p className="text-muted-foreground">
            {canManageTimetable 
              ? "Automated scheduling system with constraint optimization"
              : userRole === "faculty" 
                ? "View your teaching schedule and class assignments"
                : "View your class schedule and timings"
            }
          </p>
        </div>
        {canManageTimetable && (
          <Button 
            onClick={handleGenerateTimetable}
            disabled={isGenerating}
            className="bg-gradient-timetable"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Generate Timetable
              </>
            )}
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="view">
            <Calendar className="h-4 w-4 mr-2" />
            View Schedule
          </TabsTrigger>
          {canManageTimetable && (
            <>
              <TabsTrigger value="setup">
                <Settings className="h-4 w-4 mr-2" />
                Setup
              </TabsTrigger>
              <TabsTrigger value="constraints">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Constraints
              </TabsTrigger>
              <TabsTrigger value="export">
                <Download className="h-4 w-4 mr-2" />
                Export
              </TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="view" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Timetable</CardTitle>
              <CardDescription>
                {userRole === "student" && "Your class schedule for this week"}
                {userRole === "faculty" && "Your teaching schedule for this week"}
                {canManageTimetable && "Current generated timetable for all batches"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {Object.entries(mockTimetableData).map(([day, classes]) => (
                  <div key={day} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-3 text-foreground">{day}</h3>
                    <div className="grid gap-3">
                      {classes.map((cls, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center space-x-4">
                            <Badge variant="outline" className="bg-gradient-timetable text-white border-0">
                              <Clock className="h-3 w-3 mr-1" />
                              {cls.time}
                            </Badge>
                            <div>
                              <p className="font-medium text-foreground">{cls.subject}</p>
                              <p className="text-sm text-muted-foreground">
                                {cls.faculty} • {cls.batch}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline">
                            <MapPin className="h-3 w-3 mr-1" />
                            {cls.room}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {canManageTimetable && (
          <>
            <TabsContent value="setup" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Classrooms & Labs</CardTitle>
                    <CardDescription>Manage room capacity and equipment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Room Name</Label>
                        <Input placeholder="e.g., CS-101" />
                      </div>
                      <div>
                        <Label>Capacity</Label>
                        <Input type="number" placeholder="60" />
                      </div>
                    </div>
                    <div>
                      <Label>Equipment</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select equipment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="projector">Projector</SelectItem>
                          <SelectItem value="lab">Computer Lab</SelectItem>
                          <SelectItem value="whiteboard">Whiteboard</SelectItem>
                          <SelectItem value="av">Audio/Video</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="secondary" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Bulk Upload CSV
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Student Batches</CardTitle>
                    <CardDescription>Configure student groups and enrollment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Batch Name</Label>
                        <Input placeholder="e.g., CS-3A" />
                      </div>
                      <div>
                        <Label>Students Count</Label>
                        <Input type="number" placeholder="45" />
                      </div>
                    </div>
                    <div>
                      <Label>Department</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cs">Computer Science</SelectItem>
                          <SelectItem value="it">Information Technology</SelectItem>
                          <SelectItem value="ece">Electronics & Communication</SelectItem>
                          <SelectItem value="me">Mechanical Engineering</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="secondary" className="w-full">
                      <Users className="h-4 w-4 mr-2" />
                      Add Batch
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Subjects & Courses</CardTitle>
                    <CardDescription>Define subjects and weekly hour requirements</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Subject Name</Label>
                      <Input placeholder="e.g., Data Structures" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Subject Code</Label>
                        <Input placeholder="e.g., CS301" />
                      </div>
                      <div>
                        <Label>Hours/Week</Label>
                        <Input type="number" placeholder="4" />
                      </div>
                    </div>
                    <div>
                      <Label>Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lecture">Lecture</SelectItem>
                          <SelectItem value="lab">Laboratory</SelectItem>
                          <SelectItem value="tutorial">Tutorial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="secondary" className="w-full">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Add Subject
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Faculty Assignment</CardTitle>
                    <CardDescription>Assign faculty to subjects and set availability</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Faculty Name</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select faculty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="smith">Dr. Smith</SelectItem>
                          <SelectItem value="johnson">Prof. Johnson</SelectItem>
                          <SelectItem value="williams">Dr. Williams</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Qualified Subjects</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subjects" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ds">Data Structures</SelectItem>
                          <SelectItem value="algo">Algorithms</SelectItem>
                          <SelectItem value="db">Database Systems</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Max Hours/Week</Label>
                        <Input type="number" placeholder="20" />
                      </div>
                      <div>
                        <Label>Avg Leaves/Month</Label>
                        <Input type="number" placeholder="2" />
                      </div>
                    </div>
                    <Button variant="secondary" className="w-full">
                      <Users className="h-4 w-4 mr-2" />
                      Assign Faculty
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="constraints" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Scheduling Constraints</CardTitle>
                  <CardDescription>
                    Configure hard and soft constraints for OptaPlanner-based optimization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2 text-error" />
                        Hard Constraints
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <span className="text-sm">No faculty/batch overlap</span>
                          <Badge variant="destructive">Required</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <span className="text-sm">Room capacity compliance</span>
                          <Badge variant="destructive">Required</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <span className="text-sm">Equipment requirements</span>
                          <Badge variant="destructive">Required</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <span className="text-sm">Fixed special slots</span>
                          <Badge variant="destructive">Required</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-success" />
                        Soft Constraints
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <span className="text-sm block">Minimize faculty idle gaps</span>
                            <Input type="range" className="mt-1" min="0" max="100" defaultValue="80" />
                          </div>
                          <Badge variant="secondary">Weight: 80</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <span className="text-sm block">Balance daily teaching load</span>
                            <Input type="range" className="mt-1" min="0" max="100" defaultValue="70" />
                          </div>
                          <Badge variant="secondary">Weight: 70</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <span className="text-sm block">Limit consecutive classes</span>
                            <Input type="number" className="mt-1" placeholder="3" />
                          </div>
                          <Badge variant="secondary">Max: 3</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Solver Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Max Solving Time</Label>
                        <Select defaultValue="300">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="60">1 minute</SelectItem>
                            <SelectItem value="300">5 minutes</SelectItem>
                            <SelectItem value="600">10 minutes</SelectItem>
                            <SelectItem value="1800">30 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Alternative Solutions</Label>
                        <Select defaultValue="3">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 solution</SelectItem>
                            <SelectItem value="3">3 solutions</SelectItem>
                            <SelectItem value="5">5 solutions</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Conflict Resolution</Label>
                        <Select defaultValue="auto">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="auto">Automatic</SelectItem>
                            <SelectItem value="manual">Manual Review</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="export" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Export & Reports</CardTitle>
                  <CardDescription>
                    Generate timetable reports in various formats
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground">Export Options</h3>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                          <FileText className="h-4 w-4 mr-2" />
                          Export as PDF
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Table className="h-4 w-4 mr-2" />
                          Export as Excel
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Upload className="h-4 w-4 mr-2" />
                          Export as CSV
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground">Report Types</h3>
                      <div className="space-y-3">
                        <Button variant="secondary" className="w-full justify-start">
                          <Users className="h-4 w-4 mr-2" />
                          Faculty-wise Schedule
                        </Button>
                        <Button variant="secondary" className="w-full justify-start">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Batch-wise Schedule
                        </Button>
                        <Button variant="secondary" className="w-full justify-start">
                          <MapPin className="h-4 w-4 mr-2" />
                          Room Utilization
                        </Button>
                        <Button variant="secondary" className="w-full justify-start">
                          <Clock className="h-4 w-4 mr-2" />
                          Time Slot Analysis
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default TimetableModule;