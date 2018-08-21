import React from "react";
import "./CityDropdown.css";

export const CityDropdown = ({ onChange, children }) => {
  console.log(onChange);
  return (
      <select onChange={onChange} className='selectForCity'>
    {children}
      </select>
  );
};
