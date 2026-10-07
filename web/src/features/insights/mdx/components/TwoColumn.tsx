import React from "react";

export const TwoColumn = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-cols-2 gap-8">
      {children}
    </div>
  );
};