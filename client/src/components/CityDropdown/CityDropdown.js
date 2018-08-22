import React from "react";
import "./CityDropdown.css";

export const CityDropdown = ({ onChange, children }) => {
  return (
      <select onChange={onChange} className='selectForCity'>
    {children}
      </select>
  );
};
