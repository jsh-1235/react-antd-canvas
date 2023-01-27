import styles from "./Common.module.css";

import React from "react";

import { Empty, Button } from "antd";

function NotFound() {
  const style = {
    gridColumn: "1 / span 2",
    alignSelf: "center",
    justifySelf: "center",
  };

  return (
    <div style={style}>
      <Empty
        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
        imageStyle={{
          height: 60,
        }}
        description={
          <span>
            Customize <a href="#API">Description</a>
          </span>
        }>
        <Button type="primary">Create Now</Button>
      </Empty>
    </div>
  );
}

export default NotFound;
