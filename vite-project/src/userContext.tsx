import { createContext, useState} from "react";
import type { ReactNode } from "react";

export type User = {
  firstName?: string;
  lastName: string;
  email?: string;
  _id?: string;
  roles?: string[]; // Add this drivewayIds?: string[];
drivewayIds?: string[];
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
