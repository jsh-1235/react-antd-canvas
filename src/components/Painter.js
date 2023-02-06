import styles from "./Painter.module.css";

import React, { useEffect } from "react";

export default function Painter({ ...props }) {
  useEffect(() => {
    // console.log(props);

    return () => {};
  }, []);

  useEffect(() => {
    console.log(props.url);

    return () => {};
  }, [props.url]);

  // console.log(props.url.key);

  return <div className={styles.painter}>{props.pages[props.url.key]}</div>;
}
