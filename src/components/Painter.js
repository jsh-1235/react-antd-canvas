import styles from "./Painter.module.css";

import React, { useState, useEffect } from "react";

export default function Painter({ ...props }) {
  const [html, setHTML] = useState("");

  useEffect(() => {
    // console.log(props);

    return () => {};
  }, []);

  useEffect(() => {
    // console.log(props);

    return () => {};
  }, [props.url]);

  // console.log(props.url.key);

  return <div className={styles.painter}>{props.pages[props.url.key]}</div>;
}
