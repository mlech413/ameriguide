import React from "react";

export const ListItem = props => (
  <li className="list-group-item">
   <a href={props.url} target='blank'>{props.title}</a>
  </li>
);
