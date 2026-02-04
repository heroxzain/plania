import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  fullName: string;
  displayName: string;
  email: string;
}

interface Subject {
  id: string;
  name: string;
  examDate: string;
  difficulty: 'easy' | 'medium' | 'hard';
  materials: File[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (fullName: string, displayName: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  subjects: Subject[];
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (name: string, updates: Partial<Subject>) => void;
  removeSubject: (name: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database
const mockUsers = [
  {
    email: 'demo@plania.com',
    password: 'demo123',
    fullName: 'Demo User',
    displayName: 'Demo'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('plania_user');
    const storedSubjects = localStorage.getItem('plania_subjects');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedSubjects) {
      setSubjects(JSON.parse(storedSubjects));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - replace with actual API call
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userData = {
        fullName: foundUser.fullName,
        displayName: foundUser.displayName,
        email: foundUser.email
      };
      setUser(userData);
      localStorage.setItem('plania_user', JSON.stringify(userData));
      return true;
    }
    
    // Check if user exists in localStorage (signed up users)
    const storedUsers = localStorage.getItem('plania_registered_users');
    if (storedUsers) {
      const registeredUsers = JSON.parse(storedUsers);
      const registeredUser = registeredUsers.find((u: any) => u.email === email && u.password === password);
      if (registeredUser) {
        const userData = {
          fullName: registeredUser.fullName,
          displayName: registeredUser.displayName,
          email: registeredUser.email
        };
        setUser(userData);
        localStorage.setItem('plania_user', JSON.stringify(userData));
        return true;
      }
    }
    
    return false;
  };

  const signup = async (
    fullName: string,
    displayName: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    // Mock signup - replace with actual API call
    const storedUsers = localStorage.getItem('plania_registered_users');
    const registeredUsers = storedUsers ? JSON.parse(storedUsers) : [];
    
    // Check if email already exists
    if (registeredUsers.some((u: any) => u.email === email)) {
      return false;
    }
    
    const newUser = { fullName, displayName, email, password };
    registeredUsers.push(newUser);
    localStorage.setItem('plania_registered_users', JSON.stringify(registeredUsers));
    
    const userData = { fullName, displayName, email };
    setUser(userData);
    localStorage.setItem('plania_user', JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('plania_user');
  };

  const addSubject = (subject: Omit<Subject, 'id'>) => {
    const newSubject = {
      ...subject,
      id: Date.now().toString()
    };
    const updatedSubjects = [...subjects, newSubject];
    setSubjects(updatedSubjects);
    localStorage.setItem('plania_subjects', JSON.stringify(updatedSubjects));
  };

  const updateSubject = (name: string, updates: Partial<Subject>) => {
    const updatedSubjects = subjects.map(subject =>
      subject.name.toLowerCase() === name.toLowerCase()
        ? { ...subject, ...updates }
        : subject
    );
    setSubjects(updatedSubjects);
    localStorage.setItem('plania_subjects', JSON.stringify(updatedSubjects));
  };

  const removeSubject = (name: string) => {
    const updatedSubjects = subjects.filter(
      subject => subject.name.toLowerCase() !== name.toLowerCase()
    );
    setSubjects(updatedSubjects);
    localStorage.setItem('plania_subjects', JSON.stringify(updatedSubjects));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        subjects,
        addSubject,
        updateSubject,
        removeSubject
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
