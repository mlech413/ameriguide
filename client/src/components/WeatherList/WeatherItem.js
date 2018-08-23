import React from "react";

export const WeatherItem = props => (
	<tr className="table-group-item">
      <td> {props.dispWeatherMonthPrev}  /  {props.dispWeatherDayPrev} </td>
      <td> {props.dispHighTempForDay} </td>
      <td>  {props.dispLowTempForDay}  </td>
      <td>  {props.dispDescForDay}  </td>
  </tr>
);
