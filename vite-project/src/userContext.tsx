import { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";

export type User = {
  name?: string;
  email?: string;
  _id?: string;
  
};

export type UserContextType = {
  user: User | null;
  setUser: (u: User | null) => void;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
