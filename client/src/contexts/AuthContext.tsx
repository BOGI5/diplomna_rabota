import { createContext, useContext, useState, ReactNode } from "react";

export interface UserDef {
  id: string;
  firstName: string;
  lastName: string;
  picture: string | null;
  accessToken: string;
  refreshToken: string;
}

export interface AuthStateDef {
  user: UserDef | null;
  setUser: (data: UserDef) => void;
  removeUser: () => void;
}

const AuthContext = createContext<AuthStateDef | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<UserDef | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const setUser = (user: UserDef) => {
    setUserState(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const removeUser = () => {
    setUserState(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, removeUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthState = (): AuthStateDef => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthState must be used within an AuthProvider");
  }
  return context;
};
