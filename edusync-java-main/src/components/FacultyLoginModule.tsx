import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface FacultyLoginModuleProps {
  onLogin: (user: any) => void;
}

const FacultyLoginModule = ({ onLogin }: FacultyLoginModuleProps) => {
  const { toast } = useToast();
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Mock faculty login - in a real app, this would call an API
      if (
        (credentials.email === "smith@university.edu" && credentials.password === "faculty123") ||
        (credentials.email === "johnson@university.edu" && credentials.password === "faculty456")
      ) {
        // Create mock faculty user
        const facultyUser = {
          id: credentials.email === "smith@university.edu" ? "faculty1" : "faculty2",
          name: credentials.email === "smith@university.edu" ? "Dr. Smith" : "Prof. Johnson",
          email: credentials.email,
          role: "faculty"
        };
        
        onLogin(facultyUser);
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="bg-gradient-primary p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Faculty Login</CardTitle>
          <CardDescription>
            Access your faculty dashboard
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={credentials.email}
                onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:opacity-90"
              disabled={isLoading || !credentials.email || !credentials.password}
            >
              {isLoading ? "Logging in..." : "Login to Dashboard"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p className="font-medium mb-2">Faculty Credentials:</p>
            <p><strong>Dr. Smith:</strong> smith@university.edu / faculty123</p>
            <p><strong>Prof. Johnson:</strong> johnson@university.edu / faculty456</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacultyLoginModule;