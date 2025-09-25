import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, School, Users, GraduationCap, Building } from "lucide-react";

interface LoginFormProps {
  onLogin: (credentials: { username: string; password: string; role: string }) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    role: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.username && credentials.password && credentials.role) {
      onLogin(credentials);
    }
  };

  const roles = [
    { value: "admin", label: "Administrator", icon: Building, desc: "Full system access" },
    { value: "hod", label: "HOD/Coordinator", icon: Users, desc: "Department management" },
    { value: "faculty", label: "Faculty/Teacher", icon: GraduationCap, desc: "Teaching & attendance" },
    { value: "student", label: "Student", icon: BookOpen, desc: "View schedules & attendance" },
    { value: "govt", label: "Government Authority", icon: School, desc: "Attendance reports access" },
  ];

  const selectedRole = roles.find(r => r.value === credentials.role);
  const RoleIcon = selectedRole?.icon;

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="bg-gradient-primary p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">EduManage Pro</CardTitle>
          <CardDescription>
            Education Management Platform Login
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Select Role</Label>
              <Select
                value={credentials.role}
                onValueChange={(value) => setCredentials(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose your role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => {
                    const Icon = role.icon;
                    return (
                      <SelectItem key={role.value} value={role.value}>
                        <div className="flex items-center space-x-3">
                          <Icon className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{role.label}</div>
                            <div className="text-xs text-muted-foreground">{role.desc}</div>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {selectedRole && (
              <div className="bg-muted p-3 rounded-lg flex items-center space-x-3">
                {RoleIcon && <RoleIcon className="h-5 w-5 text-primary" />}
                <div>
                  <div className="font-medium text-sm">{selectedRole.label}</div>
                  <div className="text-xs text-muted-foreground">{selectedRole.desc}</div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">
                {credentials.role === "student" ? "Registration Number" : "Email"}
              </Label>
              <Input
                id="username"
                type="text"
                placeholder={credentials.role === "student" ? "Enter your registration number" : "Enter your email"}
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {credentials.role === "student" ? "Registration Number (again)" : "Password"}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={credentials.role === "student" ? "Enter your registration number again" : "Enter your password"}
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>

            {credentials.role === "student" && (
              <div className="text-sm text-muted-foreground bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                <strong>Note:</strong> For students, both fields should be your registration number.
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:opacity-90"
              disabled={!credentials.username || !credentials.password || !credentials.role}
            >
              Login to Platform
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p className="font-medium mb-2">Demo Credentials:</p>
            <p><strong>Admin:</strong> admin@example.com / admin123</p>
            <p><strong>Faculty 1:</strong> smith@university.edu / faculty123</p>
            <p><strong>Faculty 2:</strong> johnson@university.edu / faculty456</p>
            <p><strong>Students:</strong> Registration Number as both username and password</p>
            <div className="mt-2 text-xs">
              <p>Example: 22F41A0424 / 22F41A0424</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;