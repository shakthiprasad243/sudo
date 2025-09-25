import { supabase } from '../lib/supabaseClient';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: "admin" | "hod" | "faculty" | "student" | "govt";
  password?: string;
  createdAt: string;
  isActive: boolean;
}

export interface CreateUserData {
  username: string;
  email: string;
  fullName: string;
  role: User['role'];
  password: string;
}

// In-memory storage for mock users (in a real app, this would be in a database)
let mockUsers: User[] = [
  {
    id: 'admin-1',
    username: 'admin',
    email: 'admin@example.com',
    fullName: 'System Administrator',
    role: 'admin',
    password: 'admin123',
    createdAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: 'hod-1',
    username: 'hod',
    email: 'hod@example.com',
    fullName: 'Head of Department',
    role: 'hod',
    password: 'hod123',
    createdAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: 'faculty-1',
    username: 'faculty1',
    email: 'smith@university.edu',
    fullName: 'Dr. Smith',
    role: 'faculty',
    password: 'faculty123',
    createdAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: 'faculty-2',
    username: 'faculty2',
    email: 'johnson@university.edu',
    fullName: 'Prof. Johnson',
    role: 'faculty',
    password: 'faculty456',
    createdAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: 'govt-1',
    username: 'govt',
    email: 'govt@example.com',
    fullName: 'Government Authority',
    role: 'govt',
    password: 'govt123',
    createdAt: new Date().toISOString(),
    isActive: true
  }
];

// Add some sample students
const sampleStudents = [
  { regNo: '22F41A0401', name: 'A AYESHA SIDDIKHA' },
  { regNo: '22F41A0402', name: 'AKASH G' },
  { regNo: '22F41A0403', name: 'ALAKAM JAGADEESH' },
  { regNo: '22F41A0424', name: 'E CHARAN KUMAR REDDY' },
  { regNo: '22F41A0470', name: 'RAJUPETA SHAKTHI PRASAD' }
];

sampleStudents.forEach((student, index) => {
  mockUsers.push({
    id: `student-${index + 1}`,
    username: student.regNo,
    email: `${student.regNo.toLowerCase()}@university.edu`,
    fullName: student.name,
    role: 'student',
    password: student.regNo,
    createdAt: new Date().toISOString(),
    isActive: true
  });
});

/**
 * Create a single user
 */
export const createUser = async (userData: CreateUserData): Promise<User> => {
  console.log("Creating user:", userData);
  
  try {
    // Check if username or email already exists
    const existingUser = mockUsers.find(
      user => user.username === userData.username || user.email === userData.email
    );
    
    if (existingUser) {
      throw new Error("Username or email already exists");
    }

    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2)}`,
      username: userData.username,
      email: userData.email,
      fullName: userData.fullName,
      role: userData.role,
      password: userData.password,
      createdAt: new Date().toISOString(),
      isActive: true
    };

    mockUsers.push(newUser);
    console.log("User created successfully:", newUser);
    
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Create multiple users in bulk
 */
export const createBulkUsers = async (usersData: Omit<User, 'id' | 'createdAt' | 'isActive'>[]): Promise<User[]> => {
  console.log("Creating bulk users:", usersData);
  
  try {
    const createdUsers: User[] = [];
    const errors: string[] = [];

    for (const userData of usersData) {
      try {
        // Check if username or email already exists
        const existingUser = mockUsers.find(
          user => user.username === userData.username || user.email === userData.email
        );
        
        if (existingUser) {
          errors.push(`User ${userData.username} already exists`);
          continue;
        }

        const newUser: User = {
          id: `user-${Date.now()}-${Math.random().toString(36).substring(2)}`,
          username: userData.username,
          email: userData.email,
          fullName: userData.fullName,
          role: userData.role,
          password: userData.password,
          createdAt: new Date().toISOString(),
          isActive: true
        };

        mockUsers.push(newUser);
        createdUsers.push(newUser);
      } catch (error) {
        errors.push(`Failed to create user ${userData.username}: ${error}`);
      }
    }

    if (errors.length > 0) {
      console.warn("Some users failed to create:", errors);
    }

    console.log(`Successfully created ${createdUsers.length} users`);
    return createdUsers;
  } catch (error) {
    console.error('Error creating bulk users:', error);
    throw error;
  }
};

/**
 * Get all users
 */
export const getAllUsers = async (): Promise<User[]> => {
  console.log("Fetching all users");
  
  try {
    // In a real app, this would be a database query
    // For demo purposes, we return the mock data
    console.log(`Returning ${mockUsers.length} users`);
    return [...mockUsers]; // Return a copy to prevent direct mutation
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (id: string): Promise<User | null> => {
  console.log("Fetching user by ID:", id);
  
  try {
    const user = mockUsers.find(u => u.id === id);
    return user || null;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
};

/**
 * Get user by username
 */
export const getUserByUsername = async (username: string): Promise<User | null> => {
  console.log("Fetching user by username:", username);
  
  try {
    const user = mockUsers.find(u => u.username === username);
    return user || null;
  } catch (error) {
    console.error('Error fetching user by username:', error);
    throw error;
  }
};

/**
 * Update user
 */
export const updateUser = async (id: string, updateData: Partial<CreateUserData>): Promise<User | null> => {
  console.log("Updating user:", id, updateData);
  
  try {
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    // Check for duplicate username/email if they're being updated
    if (updateData.username || updateData.email) {
      const existingUser = mockUsers.find(
        user => user.id !== id && (
          (updateData.username && user.username === updateData.username) ||
          (updateData.email && user.email === updateData.email)
        )
      );
      
      if (existingUser) {
        throw new Error("Username or email already exists");
      }
    }

    const updatedUser = {
      ...mockUsers[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    mockUsers[userIndex] = updatedUser;
    console.log("User updated successfully:", updatedUser);
    
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Delete user
 */
export const deleteUser = async (id: string): Promise<boolean> => {
  console.log("Deleting user:", id);
  
  try {
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    mockUsers.splice(userIndex, 1);
    console.log("User deleted successfully");
    
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

/**
 * Toggle user active status
 */
export const toggleUserStatus = async (id: string): Promise<User | null> => {
  console.log("Toggling user status:", id);
  
  try {
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    mockUsers[userIndex].isActive = !mockUsers[userIndex].isActive;
    console.log("User status toggled:", mockUsers[userIndex]);
    
    return mockUsers[userIndex];
  } catch (error) {
    console.error('Error toggling user status:', error);
    throw error;
  }
};

/**
 * Authenticate user (for login)
 */
export const authenticateUser = async (username: string, password: string): Promise<User | null> => {
  console.log("Authenticating user:", username);
  
  try {
    const user = mockUsers.find(
      u => u.username === username && u.password === password && u.isActive
    );
    
    if (user) {
      console.log("User authenticated successfully:", user.username);
      // Return user without password for security
      const { password: _, ...userWithoutPassword } = user;
      return { ...userWithoutPassword, password: undefined };
    }
    
    console.log("Authentication failed for user:", username);
    return null;
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw error;
  }
};

/**
 * Get users by role
 */
export const getUsersByRole = async (role: User['role']): Promise<User[]> => {
  console.log("Fetching users by role:", role);
  
  try {
    const users = mockUsers.filter(u => u.role === role);
    console.log(`Found ${users.length} users with role ${role}`);
    return users;
  } catch (error) {
    console.error('Error fetching users by role:', error);
    throw error;
  }
};

/**
 * Search users
 */
export const searchUsers = async (query: string): Promise<User[]> => {
  console.log("Searching users with query:", query);
  
  try {
    const lowercaseQuery = query.toLowerCase();
    const users = mockUsers.filter(u => 
      u.username.toLowerCase().includes(lowercaseQuery) ||
      u.email.toLowerCase().includes(lowercaseQuery) ||
      u.fullName.toLowerCase().includes(lowercaseQuery)
    );
    
    console.log(`Found ${users.length} users matching query`);
    return users;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};
