"use client";

import { createContext, useState, useContext } from "react";

interface SlidebarProviderType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const sidebarContext = createContext<SlidebarProviderType | undefined>(
  undefined
);

export const SlidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <sidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </sidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(sidebarContext);

  if (context === undefined) {
    throw new Error("useSidebar must be used within a SlidebarProvider");
  }

  return context;
};
