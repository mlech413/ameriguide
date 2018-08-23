import React from "react";
import "./Weather.css";

export const Weather = ({ children }) => {
  return (
    <div className="list-overflow-container" style={{ opacity: 0.8 }}>
    <h2><center>Upcoming Weather</center></h2>
      <table className="table-group" style={{width: "100%"}}>
        <tr>
          <th>Date</th><th>High</th><th>Low</th><th>Outlook</th>
        </tr>
          {children}
      </table>
    </div>
  );
};
