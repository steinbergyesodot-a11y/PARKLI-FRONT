import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

interface Driveway {
  _id: string;
  address: string;
  publicDisplay: string;
  walk: number;
  name: string;
  stadium: string;
  price: number;
  description: string;
  rules: string[]
  images: string[];
  PostedAt: string;
}


interface DrivewayContextType {
  driveway: Driveway | null;
}

const DrivewayContext = createContext<DrivewayContextType | undefined>(undefined);

export function DrivewayProvider({ children, driveway }: { children: ReactNode; driveway: Driveway | null }) {
  return (
    <DrivewayContext.Provider value={{ driveway }}>
      {children}
    </DrivewayContext.Provider>
  );
}

export function useDrivewayContext() {
  const context = useContext(DrivewayContext);
  if (context === undefined) {
    throw new Error('useDrivewayContext must be used within a DrivewayProvider');
  }
  return context;
}
