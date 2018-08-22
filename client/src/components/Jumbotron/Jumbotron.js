import React from "react";

const Jumbotron = ({ children }) => (
  <div
    style={{ height: 300, clear: "both", paddingTop: 30, textAlign: "center", opacity: 0.8, overflow: "scroll", color: "black" }}
    className="jumbotron"
  >
    {children}
  </div>
);

export default Jumbotron;
