import React from "react";

const Jumbotron = ({ children }) => (
  <div
    style={{ height: 300, clear: "both", paddingTop: 120, textAlign: "center", opacity: 0.8 }}
    className="jumbotron"
  >
    {children}
  </div>
);

export default Jumbotron;
