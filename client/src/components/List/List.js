import React from "react";
import "./List.css";

export const List = ({ children }) => {
  return (
    <div className="list-overflow-container" style={{ opacity: 0.8 }}>
      <ul className="list-group">
        {children}
      </ul>
    </div>
  );
};
