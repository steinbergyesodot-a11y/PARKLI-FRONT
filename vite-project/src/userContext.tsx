import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

export type User = {
  firstName?: string;
  lastName: string;
  email?: string;
  _id?: string;
  roles?: string[];
  drivewayIds?: string[];
};

export type UserContextType = {
  user: User | null;
  setUser: (u: User | null) => void;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000;

      if (decoded.exp && decoded.exp > now) {
        setUser({
          _id: decoded._id,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          email: decoded.email,
          roles: decoded.roles,
          drivewayIds: decoded.drivewayIds
        });
      } else {
        localStorage.removeItem("authToken");
      }
    } catch (err) {
      localStorage.removeItem("authToken");
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
