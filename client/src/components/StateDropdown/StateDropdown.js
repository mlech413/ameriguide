import React from "react";
import "./StateDropdown.css";

export const StateDropdown = ({ onChange, children }) => {
  return (
      <select onChange={onChange} className='selectForState'>
    {children}
      </select>
  );
};
