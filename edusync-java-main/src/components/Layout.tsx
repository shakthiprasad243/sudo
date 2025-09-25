import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Users, 
  BookOpen, 
  Settings, 
  LogOut, 
  Home,
  Clock,
  UserCheck,
  Upload,
  FileText,
  UserPlus
} from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  userRole: "admin" | "hod" | "faculty" | "student" | "govt";
  currentSection: string;
  onNavigate: (section: string) => void;
  onLogout: () => void;
  currentUser?: { username: string; name?: string; id?: string };
}

const Layout = ({ children, userRole, currentSection, onNavigate, onLogout, currentUser }: LayoutProps) => {
  const getNavigationItems = () => {
    const baseItems = [
      { id: "dashboard", label: "Dashboard", icon: Home },
    ];

    if (userRole === "admin" || userRole === "hod") {
      return [
        ...baseItems,
        { id: "timetable", label: "Timetable", icon: Calendar },
        { id: "attendance", label: "Attendance", icon: UserCheck },
        { id: "faculty", label: "Faculty", icon: Users },
        { id: "students", label: "Students", icon: BookOpen },
        { id: "user-management", label: "User Management", icon: UserPlus },
        { id: "settings", label: "Settings", icon: Settings },
      ];
    }

    if (userRole === "faculty") {
      return [
        ...baseItems,
        { id: "timetable", label: "My Timetable", icon: Calendar },
        { id: "attendance", label: "Take Attendance", icon: UserCheck },
        { id: "students", label: "My Students", icon: BookOpen },
        { id: "faculty-dashboard", label: "Student Submissions", icon: FileText },
        { id: "user-management", label: "Manage Students", icon: UserPlus },
      ];
    }

    if (userRole === "student") {
      return [
        ...baseItems,
        { id: "timetable", label: "My Timetable", icon: Calendar },
        { id: "attendance", label: "My Attendance", icon: Clock },
        { id: "uploads", label: "My Uploads", icon: Upload },
      ];
    }

    if (userRole === "govt") {
      return [
        ...baseItems,
        { id: "attendance", label: "Attendance Reports", icon: UserCheck },
        { id: "analytics", label: "Analytics", icon: BookOpen },
      ];
    }

    return baseItems;
  };

  const getRoleBadgeVariant = () => {
    switch (userRole) {
      case "admin": return "destructive";
      case "hod": return "default";
      case "faculty": return "secondary";
      case "student": return "outline";
      case "govt": return "default";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">EduManage Pro</h1>
                <p className="text-sm text-muted-foreground">Education Management Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                {currentUser?.name && (
                  <p className="text-sm font-medium">{currentUser.name}</p>
                )}
                <Badge variant={getRoleBadgeVariant()}>
                  {userRole.toUpperCase()}
                </Badge>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Card className="p-4">
              <nav className="space-y-2">
                {getNavigationItems().map((item) => {
                  const Icon = item.icon;
                  const isActive = currentSection === item.id;
                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => onNavigate(item.id)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                  );
                })}
              </nav>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;