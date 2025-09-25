import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Users, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";

interface DashboardProps {
  userRole: "admin" | "hod" | "faculty" | "student" | "govt";
  onNavigate: (section: string) => void;
}

const Dashboard = ({ userRole, onNavigate }: DashboardProps) => {
  const getWelcomeMessage = () => {
    switch (userRole) {
      case "admin":
        return {
          title: "Administrator Dashboard",
          subtitle: "Complete system overview and management tools"
        };
      case "hod":
        return {
          title: "Department Coordinator Dashboard", 
          subtitle: "Manage department schedules and faculty coordination"
        };
      case "faculty":
        return {
          title: "Faculty Dashboard",
          subtitle: "Your teaching schedule and attendance management"
        };
      case "student":
        return {
          title: "Student Dashboard", 
          subtitle: "Your class schedules and attendance records"
        };
      case "govt":
        return {
          title: "Government Authority Dashboard",
          subtitle: "Rural school attendance monitoring and reports"
        };
      default:
        return {
          title: "Dashboard",
          subtitle: "Welcome to EduManage Pro"
        };
    }
  };

  const getStats = () => {
    if (userRole === "admin" || userRole === "hod") {
      return [
        {
          title: "Active Faculty",
          value: "124",
          change: "+8%",
          icon: Users,
          color: "bg-gradient-secondary"
        },
        {
          title: "Student Batches", 
          value: "32",
          change: "+2%",
          icon: BookOpen,
          color: "bg-gradient-primary"
        },
        {
          title: "Classes Today",
          value: "156",
          change: "95%",
          icon: Calendar,
          color: "bg-gradient-timetable"
        },
        {
          title: "Attendance Rate",
          value: "87.3%",
          change: "+2.1%",
          icon: CheckCircle,
          color: "bg-gradient-attendance"
        }
      ];
    }

    if (userRole === "faculty") {
      return [
        {
          title: "Today's Classes",
          value: "6",
          change: "On schedule",
          icon: Calendar,
          color: "bg-gradient-timetable"
        },
        {
          title: "Students Enrolled",
          value: "180",
          change: "3 batches",
          icon: Users,
          color: "bg-gradient-secondary"
        },
        {
          title: "Avg Attendance",
          value: "89.2%",
          change: "+1.5%",
          icon: CheckCircle,
          color: "bg-gradient-attendance"
        },
        {
          title: "Pending Reviews",
          value: "12",
          change: "This week",
          icon: Clock,
          color: "bg-gradient-primary"
        }
      ];
    }

    if (userRole === "student") {
      return [
        {
          title: "Today's Classes",
          value: "4",
          change: "Next at 2 PM",
          icon: Calendar,
          color: "bg-gradient-timetable"
        },
        {
          title: "My Attendance",
          value: "91.5%",
          change: "Excellent",
          icon: CheckCircle,
          color: "bg-gradient-attendance"
        },
        {
          title: "Subjects Enrolled",
          value: "7",
          change: "This semester",
          icon: BookOpen,
          color: "bg-gradient-secondary"
        },
        {
          title: "Assignments Due",
          value: "3",
          change: "Next week",
          icon: Clock,
          color: "bg-gradient-primary"
        }
      ];
    }

    if (userRole === "govt") {
      return [
        {
          title: "Rural Schools",
          value: "45",
          change: "Monitored",
          icon: BookOpen,
          color: "bg-gradient-secondary"
        },
        {
          title: "Avg Attendance",
          value: "83.7%",
          change: "+5.2%",
          icon: CheckCircle,
          color: "bg-gradient-attendance"
        },
        {
          title: "Schools Reporting",
          value: "42/45",
          change: "93.3%",
          icon: TrendingUp,
          color: "bg-gradient-primary"
        },
        {
          title: "Issues Flagged",
          value: "7",
          change: "This month",
          icon: AlertCircle,
          color: "bg-gradient-timetable"
        }
      ];
    }

    return [];
  };

  const getQuickActions = () => {
    if (userRole === "admin" || userRole === "hod") {
      return [
        { label: "Generate Timetable", action: () => onNavigate("timetable"), variant: "timetable" as const },
        { label: "View Attendance", action: () => onNavigate("attendance"), variant: "attendance" as const },
        { label: "Manage Faculty", action: () => onNavigate("faculty"), variant: "secondary" as const },
        { label: "System Settings", action: () => onNavigate("settings"), variant: "outline" as const }
      ];
    }

    if (userRole === "faculty") {
      return [
        { label: "Take Attendance", action: () => onNavigate("attendance"), variant: "attendance" as const },
        { label: "View My Schedule", action: () => onNavigate("timetable"), variant: "timetable" as const },
        { label: "Student Records", action: () => onNavigate("students"), variant: "secondary" as const }
      ];
    }

    if (userRole === "student") {
      return [
        { label: "View Timetable", action: () => onNavigate("timetable"), variant: "timetable" as const },
        { label: "Check Attendance", action: () => onNavigate("attendance"), variant: "attendance" as const }
      ];
    }

    if (userRole === "govt") {
      return [
        { label: "Attendance Reports", action: () => onNavigate("attendance"), variant: "attendance" as const },
        { label: "Analytics Dashboard", action: () => onNavigate("analytics"), variant: "secondary" as const }
      ];
    }

    return [];
  };

  const getRecentActivities = () => {
    const activities = [
      { type: "success", message: "Timetable for CS Department published", time: "2 hours ago" },
      { type: "info", message: "Attendance recorded for Batch A", time: "4 hours ago" },
      { type: "warning", message: "Low attendance alert for Subject XYZ", time: "6 hours ago" },
      { type: "success", message: "New faculty member added", time: "1 day ago" }
    ];

    return activities.map((activity, index) => (
      <div key={index} className="flex items-start space-x-3 p-3 hover:bg-muted rounded-lg transition-colors">
        {activity.type === "success" && <CheckCircle className="h-5 w-5 text-success mt-0.5" />}
        {activity.type === "info" && <Clock className="h-5 w-5 text-primary mt-0.5" />}
        {activity.type === "warning" && <AlertCircle className="h-5 w-5 text-warning mt-0.5" />}
        {activity.type === "error" && <XCircle className="h-5 w-5 text-error mt-0.5" />}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">{activity.message}</p>
          <p className="text-xs text-muted-foreground">{activity.time}</p>
        </div>
      </div>
    ));
  };

  const { title, subtitle } = getWelcomeMessage();
  const stats = getStats();
  const quickActions = getQuickActions();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground mt-1">{subtitle}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant}
                className="w-full justify-start"
                onClick={action.action}
              >
                {action.label}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest system updates and notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {getRecentActivities()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;