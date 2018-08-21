import React from "react";

export const TextArea = props => (
  <div className="form-group" style={{ opacity: 0.8 }}>
    <textarea className="form-control" rows="20" {...props} />
  </div>
);
