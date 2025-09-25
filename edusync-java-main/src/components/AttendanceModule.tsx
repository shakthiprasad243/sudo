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
  Camera, 
  CreditCard, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Download,
  Upload,
  Wifi,
  WifiOff,
  Smartphone,
  MonitorSpeaker,
  FileText,
  BarChart,
  UserCheck,
  Eye
} from "lucide-react";

interface AttendanceModuleProps {
  userRole: "admin" | "hod" | "faculty" | "student" | "govt";
}

const AttendanceModule = ({ userRole }: AttendanceModuleProps) => {
  const [activeTab, setActiveTab] = useState("session");
  const [attendanceMode, setAttendanceMode] = useState<"facial" | "rfid">("facial");
  const [isOnline, setIsOnline] = useState(true);
  const [sessionActive, setSessionActive] = useState(false);

  const mockAttendanceData = [
    { id: "ST001", name: "Alice Johnson", batch: "CS-3A", status: "present", time: "09:15 AM", method: "facial" },
    { id: "ST002", name: "Bob Smith", batch: "CS-3A", status: "present", time: "09:12 AM", method: "rfid" },
    { id: "ST003", name: "Carol Davis", batch: "CS-3A", status: "absent", time: "-", method: "-" },
    { id: "ST004", name: "David Wilson", batch: "CS-3A", status: "present", time: "09:18 AM", method: "facial" },
    { id: "ST005", name: "Eva Brown", batch: "CS-3A", status: "late", time: "09:25 AM", method: "manual" },
  ];

  const mockReportData = {
    totalStudents: 45,
    presentToday: 38,
    absentToday: 7,
    attendanceRate: 84.4,
    weeklyTrend: "+2.3%"
  };

  const canTakeAttendance = userRole === "admin" || userRole === "hod" || userRole === "faculty";
  const canViewReports = userRole !== "student";

  if (userRole === "student") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Attendance</h2>
          <p className="text-muted-foreground">Track your attendance records and statistics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overall Attendance</p>
                  <p className="text-2xl font-bold text-foreground">91.5%</p>
                  <Badge variant="secondary" className="mt-1">Excellent</Badge>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Classes Attended</p>
                  <p className="text-2xl font-bold text-foreground">87/95</p>
                  <Badge variant="outline" className="mt-1">This Semester</Badge>
                </div>
                <Clock className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Minimum Required</p>
                  <p className="text-2xl font-bold text-foreground">75%</p>
                  <Badge variant="secondary" className="mt-1">Met ✓</Badge>
                </div>
                <BarChart className="h-8 w-8 text-attendance" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAttendanceData.slice(0, 3).map((record, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Data Structures - CS301</p>
                    <p className="text-sm text-muted-foreground">Yesterday, 09:00 AM</p>
                  </div>
                  <Badge variant={record.status === "present" ? "secondary" : "destructive"}>
                    {record.status === "present" ? "Present" : "Absent"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Attendance Management</h2>
          <p className="text-muted-foreground">
            {canTakeAttendance 
              ? "Facial recognition and RFID-based attendance system for rural schools"
              : "View attendance reports and analytics"
            }
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {isOnline ? (
            <Badge variant="secondary" className="bg-success">
              <Wifi className="h-3 w-3 mr-1" />
              Online
            </Badge>
          ) : (
            <Badge variant="destructive">
              <WifiOff className="h-3 w-3 mr-1" />
              Offline
            </Badge>
          )}
          
          {canTakeAttendance && (
            <Button 
              variant={sessionActive ? "destructive" : "default"}
              className="bg-gradient-attendance"
              onClick={() => setSessionActive(!sessionActive)}
            >
              {sessionActive ? "End Session" : "Start Attendance"}
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          {canTakeAttendance && (
            <TabsTrigger value="session">
              <UserCheck className="h-4 w-4 mr-2" />
              Take Attendance
            </TabsTrigger>
          )}
          <TabsTrigger value="records">
            <Eye className="h-4 w-4 mr-2" />
            View Records
          </TabsTrigger>
          {canViewReports && (
            <>
              <TabsTrigger value="reports">
                <BarChart className="h-4 w-4 mr-2" />
                Reports
              </TabsTrigger>
              <TabsTrigger value="settings">
                <MonitorSpeaker className="h-4 w-4 mr-2" />
                System Setup
              </TabsTrigger>
            </>
          )}
        </TabsList>

        {canTakeAttendance && (
          <TabsContent value="session" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Attendance Control Panel */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Session Control</CardTitle>
                  <CardDescription>Configure attendance session</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Select Batch</Label>
                    <Select defaultValue="cs3a">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cs3a">CS-3A (45 students)</SelectItem>
                        <SelectItem value="cs3b">CS-3B (42 students)</SelectItem>
                        <SelectItem value="it3a">IT-3A (38 students)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Subject</Label>
                    <Select defaultValue="cs301">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cs301">Data Structures</SelectItem>
                        <SelectItem value="cs302">Algorithms</SelectItem>
                        <SelectItem value="cs303">Database Systems</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-base font-medium">Attendance Method</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Button
                        variant={attendanceMode === "facial" ? "default" : "outline"}
                        onClick={() => setAttendanceMode("facial")}
                        className="justify-start"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Facial
                      </Button>
                      <Button
                        variant={attendanceMode === "rfid" ? "default" : "outline"}
                        onClick={() => setAttendanceMode("rfid")}
                        className="justify-start"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        RFID
                      </Button>
                    </div>
                  </div>

                  {attendanceMode === "facial" && (
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="flex items-center space-x-3 mb-3">
                        <Camera className="h-5 w-5 text-primary" />
                        <span className="font-medium">Camera Status</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Camera Access:</span>
                          <Badge variant="secondary">Granted</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Face Detection:</span>
                          <Badge variant="secondary">Active</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Recognition Accuracy:</span>
                          <Badge variant="secondary">94.2%</Badge>
                        </div>
                      </div>
                    </div>
                  )}

                  {attendanceMode === "rfid" && (
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="flex items-center space-x-3 mb-3">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <span className="font-medium">RFID Scanner Status</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Scanner Connection:</span>
                          <Badge variant="secondary">Connected</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Signal Strength:</span>
                          <Badge variant="secondary">Strong</Badge>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-2">
                          Test Scanner
                        </Button>
                      </div>
                    </div>
                  )}

                  <Button 
                    className="w-full bg-gradient-attendance"
                    disabled={!sessionActive}
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    Open Android App
                  </Button>
                </CardContent>
              </Card>

              {/* Live Attendance Feed */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Live Attendance Session</CardTitle>
                  <CardDescription>
                    {sessionActive ? "Session active - monitoring attendance" : "No active session"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {sessionActive ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <p className="text-2xl font-bold text-success">{mockReportData.presentToday}</p>
                          <p className="text-sm text-muted-foreground">Present</p>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <p className="text-2xl font-bold text-error">{mockReportData.absentToday}</p>
                          <p className="text-sm text-muted-foreground">Absent</p>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <p className="text-2xl font-bold text-warning">1</p>
                          <p className="text-sm text-muted-foreground">Late</p>
                        </div>
                      </div>

                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {mockAttendanceData.map((student) => (
                          <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                student.status === "present" ? "bg-success" :
                                student.status === "late" ? "bg-warning" : "bg-error"
                              }`} />
                              <div>
                                <p className="font-medium text-foreground">{student.name}</p>
                                <p className="text-sm text-muted-foreground">{student.id} • {student.batch}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant={
                                student.status === "present" ? "secondary" :
                                student.status === "late" ? "destructive" : "outline"
                              }>
                                {student.status}
                              </Badge>
                              {student.time !== "-" && (
                                <p className="text-xs text-muted-foreground mt-1">{student.time}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Start an attendance session to begin monitoring</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}

        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>View and manage attendance history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <div>
                    <Label>Date Range</Label>
                    <Input type="date" className="w-40" />
                  </div>
                  <div>
                    <Label>Batch Filter</Label>
                    <Select>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="All Batches" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Batches</SelectItem>
                        <SelectItem value="cs3a">CS-3A</SelectItem>
                        <SelectItem value="cs3b">CS-3B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Subject Filter</Label>
                    <Select>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="All Subjects" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        <SelectItem value="cs301">Data Structures</SelectItem>
                        <SelectItem value="cs302">Algorithms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border rounded-lg">
                  <div className="grid grid-cols-5 gap-4 p-3 bg-muted font-medium text-sm">
                    <div>Student</div>
                    <div>Subject</div>
                    <div>Date/Time</div>
                    <div>Status</div>
                    <div>Method</div>
                  </div>
                  {mockAttendanceData.map((record, idx) => (
                    <div key={idx} className="grid grid-cols-5 gap-4 p-3 border-t">
                      <div>
                        <p className="font-medium text-foreground">{record.name}</p>
                        <p className="text-xs text-muted-foreground">{record.id}</p>
                      </div>
                      <div className="text-sm">Data Structures</div>
                      <div className="text-sm">
                        <p>Today</p>
                        <p className="text-xs text-muted-foreground">{record.time}</p>
                      </div>
                      <div>
                        <Badge variant={
                          record.status === "present" ? "secondary" :
                          record.status === "late" ? "destructive" : "outline"
                        }>
                          {record.status}
                        </Badge>
                      </div>
                      <div className="text-sm capitalize">{record.method}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {canViewReports && (
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Analytics & Reports</CardTitle>
                <CardDescription>Generate comprehensive attendance reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Export Reports</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="h-4 w-4 mr-2" />
                        Student Attendance Report (PDF)
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Government Compliance Report (Excel)
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <BarChart className="h-4 w-4 mr-2" />
                        Attendance Analytics (CSV)
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Quick Stats</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between p-3 bg-muted rounded-lg">
                        <span>Overall Attendance Rate</span>
                        <Badge variant="secondary">{mockReportData.attendanceRate}%</Badge>
                      </div>
                      <div className="flex justify-between p-3 bg-muted rounded-lg">
                        <span>Weekly Trend</span>
                        <Badge variant="secondary">{mockReportData.weeklyTrend}</Badge>
                      </div>
                      <div className="flex justify-between p-3 bg-muted rounded-lg">
                        <span>Low Attendance Alerts</span>
                        <Badge variant="destructive">3 Students</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {canViewReports && (
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>Facial recognition and RFID system settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Face Recognition Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <Label>Recognition Threshold</Label>
                        <Input type="range" min="0" max="100" defaultValue="85" className="mt-2" />
                        <p className="text-xs text-muted-foreground mt-1">Current: 85% confidence</p>
                      </div>
                      <div>
                        <Label>Face Enrollment</Label>
                        <Button variant="outline" className="w-full mt-2">
                          <Upload className="h-4 w-4 mr-2" />
                          Bulk Enroll Students
                        </Button>
                      </div>
                      <div>
                        <Label>Privacy & Data Management</Label>
                        <div className="space-y-2 mt-2">
                          <Button variant="outline" size="sm" className="w-full">
                            Export Face Templates
                          </Button>
                          <Button variant="destructive" size="sm" className="w-full">
                            Delete All Face Data
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">RFID Configuration</h3>
                    <div className="space-y-4">
                      <div>
                        <Label>RFID Scanner Type</Label>
                        <Select defaultValue="usb">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="usb">USB Scanner</SelectItem>
                            <SelectItem value="bluetooth">Bluetooth Scanner</SelectItem>
                            <SelectItem value="network">Network Scanner</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Card Management</Label>
                        <div className="space-y-2 mt-2">
                          <Button variant="outline" size="sm" className="w-full">
                            Register New Cards
                          </Button>
                          <Button variant="outline" size="sm" className="w-full">
                            Deactivate Lost Cards
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label>Offline Sync</Label>
                        <div className="space-y-2 mt-2">
                          <div className="flex justify-between text-sm">
                            <span>Last Sync:</span>
                            <span>2 hours ago</span>
                          </div>
                          <Button variant="secondary" size="sm" className="w-full">
                            Force Sync Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default AttendanceModule;