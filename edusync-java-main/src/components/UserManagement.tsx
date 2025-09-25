import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  UserPlus, 
  Users, 
  Upload, 
  Download, 
  Trash2, 
  Edit, 
  Eye, 
  EyeOff,
  FileText,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { createUser, createBulkUsers, getAllUsers, updateUser, deleteUser } from "@/services/userService";

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: "admin" | "hod" | "faculty" | "student" | "govt";
  password?: string;
  createdAt: string;
  isActive: boolean;
}

interface UserManagementProps {
  userRole: "admin" | "hod" | "faculty" | "student" | "govt";
}

const UserManagement = ({ userRole }: UserManagementProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  
  // Single user form state
  const [singleUserForm, setSingleUserForm] = useState({
    username: "",
    email: "",
    fullName: "",
    role: "",
    password: "",
    confirmPassword: ""
  });

  // Bulk user form state
  const [bulkUserText, setBulkUserText] = useState("");
  const [bulkUsers, setBulkUsers] = useState<Omit<User, 'id' | 'createdAt' | 'isActive'>[]>([]);

  // Check permissions
  const canManageRole = (targetRole: string) => {
    if (userRole === "admin") return true;
    if (userRole === "hod") return ["faculty", "student"].includes(targetRole);
    if (userRole === "faculty") return targetRole === "student";
    return false;
  };

  const availableRoles = () => {
    if (userRole === "admin") return ["admin", "hod", "faculty", "student", "govt"];
    if (userRole === "hod") return ["faculty", "student"];
    if (userRole === "faculty") return ["student"];
    return [];
  };

  // Load users
  const loadUsers = async () => {
    setLoading(true);
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers.filter(user => canManageRole(user.role)));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle single user creation
  const handleSingleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (singleUserForm.password !== singleUserForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (!canManageRole(singleUserForm.role)) {
      toast({
        title: "Error",
        description: "You don't have permission to create this role",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const newUser = await createUser({
        username: singleUserForm.username,
        email: singleUserForm.email,
        fullName: singleUserForm.fullName,
        role: singleUserForm.role as User['role'],
        password: singleUserForm.password
      });

      setUsers(prev => [...prev, newUser]);
      setSingleUserForm({
        username: "",
        email: "",
        fullName: "",
        role: "",
        password: "",
        confirmPassword: ""
      });

      toast({
        title: "Success",
        description: "User created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Parse bulk user text
  const parseBulkUsers = () => {
    const lines = bulkUserText.trim().split('\n');
    const parsed: Omit<User, 'id' | 'createdAt' | 'isActive'>[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const parts = line.split(',').map(p => p.trim());
      if (parts.length >= 4) {
        const [username, email, fullName, role, password] = parts;
        if (canManageRole(role)) {
          parsed.push({
            username,
            email,
            fullName,
            role: role as User['role'],
            password: password || username // Default password to username if not provided
          });
        }
      }
    }
    
    setBulkUsers(parsed);
  };

  // Handle bulk user creation
  const handleBulkUserSubmit = async () => {
    if (bulkUsers.length === 0) {
      toast({
        title: "Error",
        description: "No valid users to create",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const createdUsers = await createBulkUsers(bulkUsers);
      setUsers(prev => [...prev, ...createdUsers]);
      setBulkUserText("");
      setBulkUsers([]);

      toast({
        title: "Success",
        description: `${createdUsers.length} users created successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create bulk users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle CSV file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setBulkUserText(text);
      parseBulkUsers();
    };
    reader.readAsText(file);
  };

  // Generate sample CSV
  const downloadSampleCSV = () => {
    const sampleData = [
      "username,email,fullName,role,password",
      "john.doe,john.doe@university.edu,John Doe,faculty,password123",
      "jane.smith,jane.smith@university.edu,Jane Smith,faculty,password456",
      "22F41A0500,student500@university.edu,Student Name,student,22F41A0500"
    ];
    
    const blob = new Blob([sampleData.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Toggle password visibility
  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  // Delete user
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    setLoading(true);
    try {
      await deleteUser(userId);
      setUsers(prev => prev.filter(user => user.id !== userId));
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">
            Create and manage users for the education platform
          </p>
        </div>
        <Button onClick={loadUsers} disabled={loading}>
          <Users className="h-4 w-4 mr-2" />
          Refresh Users
        </Button>
      </div>

      <Tabs defaultValue="single" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="single">Single User</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Users</TabsTrigger>
          <TabsTrigger value="manage">Manage Users</TabsTrigger>
        </TabsList>

        {/* Single User Creation */}
        <TabsContent value="single">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="h-5 w-5 mr-2" />
                Create Single User
              </CardTitle>
              <CardDescription>
                Add a new user to the system with their credentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSingleUserSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={singleUserForm.username}
                      onChange={(e) => setSingleUserForm(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="Enter username"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={singleUserForm.email}
                      onChange={(e) => setSingleUserForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={singleUserForm.fullName}
                      onChange={(e) => setSingleUserForm(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={singleUserForm.role}
                      onValueChange={(value) => setSingleUserForm(prev => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRoles().map((role) => (
                          <SelectItem key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={singleUserForm.password}
                      onChange={(e) => setSingleUserForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter password"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={singleUserForm.confirmPassword}
                      onChange={(e) => setSingleUserForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm password"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create User
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bulk User Creation */}
        <TabsContent value="bulk">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Bulk User Creation
              </CardTitle>
              <CardDescription>
                Create multiple users at once using CSV format or text input
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload CSV
                </Button>
                <Button variant="outline" onClick={downloadSampleCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="space-y-2">
                <Label htmlFor="bulkText">
                  User Data (CSV format: username,email,fullName,role,password)
                </Label>
                <Textarea
                  id="bulkText"
                  value={bulkUserText}
                  onChange={(e) => setBulkUserText(e.target.value)}
                  placeholder="john.doe,john.doe@university.edu,John Doe,faculty,password123&#10;jane.smith,jane.smith@university.edu,Jane Smith,faculty,password456"
                  rows={8}
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={parseBulkUsers}>
                  <FileText className="h-4 w-4 mr-2" />
                  Preview Users
                </Button>
                <Button 
                  onClick={handleBulkUserSubmit} 
                  disabled={loading || bulkUsers.length === 0}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Create {bulkUsers.length} Users
                </Button>
              </div>

              {bulkUsers.length > 0 && (
                <div className="space-y-2">
                  <Label>Preview ({bulkUsers.length} users)</Label>
                  <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                    {bulkUsers.map((user, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div>
                          <span className="font-medium">{user.fullName}</span>
                          <span className="text-sm text-muted-foreground ml-2">({user.username})</span>
                        </div>
                        <Badge variant="outline">{user.role}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manage Users */}
        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Manage Users
              </CardTitle>
              <CardDescription>
                View and manage existing users in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No users found. Click "Refresh Users" to load.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">{user.fullName}</h3>
                            <Badge variant="outline">{user.role}</Badge>
                            {!user.isActive && <Badge variant="destructive">Inactive</Badge>}
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p><strong>Username:</strong> {user.username}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <div className="flex items-center gap-2">
                              <strong>Password:</strong>
                              <span className="font-mono">
                                {showPasswords[user.id] ? user.password || '••••••••' : '••••••••'}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => togglePasswordVisibility(user.id)}
                              >
                                {showPasswords[user.id] ? (
                                  <EyeOff className="h-3 w-3" />
                                ) : (
                                  <Eye className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                            <p><strong>Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagement;
