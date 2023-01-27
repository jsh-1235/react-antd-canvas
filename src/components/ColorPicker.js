import styles from "./ColorPicker.module.css";

import React from "react";

import { Slider } from "antd";

function invert(hexTripletColor) {
  let color = hexTripletColor;

  color = color.substring(1);
  color = parseInt(color, 16);
  color = 0xffffff ^ color;
  color = color.toString(16);
  color = ("000000" + color).slice(-6);
  color = "#" + color;
  return color;
}

function complementary(hexTripletColor) {
  let color = hexTripletColor;

  color = color.substring(1);
  color = parseInt(color, 16);
  color = 0xffffff ^ color;
  color = color.toString(16);
  color = ("000000" + color).slice(-6);
  color = "#" + color;
  return color;
}

export default function ColorPicker({ ...props }) {
  // console.log(props);

  const handleChanged = (value) => {
    console.log(value);

    props.handleChanged(value);
  };

  return (
    <div className={styles.container} style={props.style}>
      <input type="color" value={props.color} onChange={handleChanged}></input>
      <span className={styles.value} style={{ color: invert(props.color) }}>
        {props.color}
      </span>
    </div>
  );
}
