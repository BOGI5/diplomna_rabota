import { createContext, useContext, useState, ReactNode } from "react";
import User from "../interfaces/user.interface";
import ApiService from "../services/api";
import environment from "../environment";

export interface AuthStateDef {
  user: User | null;
  setUser: (data: User) => void;
  logoutUser: () => void;
  deleteUser: () => void;
}

const AuthContext = createContext<AuthStateDef | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const apiService = new ApiService();

  const setUser = (user: User) => {
    setUserState(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logoutUser = () => {
    apiService.get(`${environment.signOutUrl}`);
    setUserState(null);
    localStorage.removeItem("user");
  };

  const deleteUser = () => {
    apiService.delete(`${environment.deleteSelf}`);
    setUserState(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logoutUser, deleteUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthStateDef => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthState must be used within an AuthProvider");
  }
  return context;
};
