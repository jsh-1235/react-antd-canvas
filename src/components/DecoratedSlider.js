import styles from "./DecoratedSlider.module.css";

import React from "react";

import { Slider } from "antd";

export default function DecoratedSlider({ ...props }) {
  // console.log(props);

  const handleChanged = (value) => {
    console.log(value);

    props.handleChanged(value);
  };

  return (
    <div className={styles.slider_container} style={props.style}>
      <span className={styles.slider_title}>
        {props.title} ({props.unit})
      </span>
      <span className={styles.slider_value}>{props.value}</span>
      <Slider className={styles.slider} min={props.min} max={props.max} value={props.value} step={props.step} marks={props.marks} included={true} autoFocus={false} disabled={props.mode === "start" ? true : false} onChange={handleChanged} />
    </div>
  );
}
