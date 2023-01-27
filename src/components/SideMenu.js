import styles from "./SideMenu.module.css";

import React, { useState, useEffect } from "react";

import { Menu } from "antd";

export function getItem(key, icon, label, children, type) {
  return {
    key,
    icon,
    label,
    children,
    type,
  };
}

export default function SideMenu({ ...props }) {
  const [items, setItems] = useState(props.items);

  useEffect(() => {
    // console.log(props.items);
    return () => {};
  }, []);

  const onClick = (e) => {
    props.onSelect(e.key);

    // console.log(e.key);
  };

  // console.log("items", items[0].children[0].key);

  return (
    <>
      <Menu className={styles.menu} onClick={onClick} defaultSelectedKeys={[items[0].children[0].key]} defaultOpenKeys={[items[0].key]} mode="inline" items={items} />
    </>
  );
}
