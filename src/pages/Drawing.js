import styles from "./Common.module.css";

import React, { useState, useEffect } from "react";

import SideMenu, { getItem } from "../components/SideMenu";
import Painter from "../components/Painter";

import { AppstoreOutlined, SettingOutlined } from "@ant-design/icons";

import Random from "./Drawing/Random";
import Point from "./Drawing/Point";
import Rotate from "./Drawing/Rotate";
import Circle from "./Drawing/Circle";
import Pen from "./Drawing/Pen";
import Ellipse from "./Drawing/Ellipse";
import CirclePen from "./Drawing/CirclePen";

const group = "Drawing";

const menu = [
  { key: "1", label: "Random" },
  { key: "2", label: "Point" },
  { key: "3", label: "Rotate" },
  { key: "4", label: "Circle" },
  { key: "5", label: "Pen" },
  { key: "6", label: "Ellipse" },
  { key: "7", label: "CirclePen" },
];

const items = [
  getItem(
    group,
    <AppstoreOutlined />,
    group,
    menu.map((item, index) => getItem(item.key, <SettingOutlined />, item.label)),
    group
  ),
];

export default function Drawing() {
  const [url, setURL] = useState({
    key: Number(menu[0].key) - 1,
    title: menu[0].label,
  });

  useEffect(() => {
    return () => {};
  }, []);

  const onSelect = (key) => {
    setURL({
      key: Number(key) - 1,
      title: menu[Number(key) - 1].label,
    });
  };

  useEffect(() => {}, [url]);

  const pages = [<Random url={url} />, <Point url={url} />, <Rotate url={url} />, <Circle url={url} />, <Pen url={url} />, <Ellipse url={url} />, <CirclePen url={url} />];

  return (
    <>
      <SideMenu items={items} onSelect={onSelect} />
      <Painter pages={pages} url={url} />
    </>
  );
}
