import styles from "./Pen.module.css";

import React, { useState, useEffect, useRef } from "react";

import { Button, Dropdown, Switch, message } from "antd";

import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

import { UserOutlined } from "@ant-design/icons";

import DecoratedSlider from "../../components/DecoratedSlider";
import ColorPicker from "../../components/ColorPicker";

import { Canvas } from "./Canvas";

class Brush {
  constructor(color, thickness) {
    this.color = color;
    this.thickness = thickness;
    this.x = 0;
    this.y = 0;
    this.isDown = false;
    this.lineCap = "butt";
    this.lineJoin = "miter";
    this.shadow = false;
  }

  getContext(canvas) {
    return canvas.getContext("2d");
  }

  draw(canvas, x1, y1, x2, y2) {
    this.getContext(canvas).beginPath();
    this.getContext(canvas).strokeStyle = this.color;
    this.getContext(canvas).lineWidth = this.thickness;
    this.getContext(canvas).lineCap = this.lineCap;
    this.getContext(canvas).lineJoin = this.lineJoin;
    // this.getContext(canvas).miterLimit = 0;

    this.getContext(canvas).shadowColor = this.shadow ? "red" : "transparent";
    this.getContext(canvas).shadowBlur = 20;
    this.getContext(canvas).shadowOffsetX = 5;
    this.getContext(canvas).shadowOffsetY = 5;

    this.getContext(canvas).moveTo(x1, y1);
    this.getContext(canvas).lineTo(x2, y2);
    this.getContext(canvas).stroke();
    this.getContext(canvas).closePath();
  }

  mousedown(canvas, e) {
    // e.preventDefault();
    // e.stopPropagation();

    this.x = e.offsetX;
    this.y = e.offsetY;
    this.isDown = true;

    console.log(e, this.x, this.y, this.isDown);
  }

  mouseup(canvas, e) {
    // e.preventDefault();
    // e.stopPropagation();

    if (this.isDown === true) {
      this.draw(canvas, this.x, this.y, e.offsetX, e.offsetY);
      this.x = 0;
      this.y = 0;
      this.isDown = false;
    }

    console.log(e, this.x, this.y, this.isDown);
  }

  mousemove(canvas, e) {
    // e.preventDefault();
    // e.stopPropagation();

    if (this.isDown === true) {
      this.draw(canvas, this.x, this.y, e.offsetX, e.offsetY);
      this.x = e.offsetX;
      this.y = e.offsetY;
    }

    console.log(e, this.x, this.y, this.isDown);
  }

  mouseout(canvas, e) {
    // e.preventDefault();
    // e.stopPropagation();

    this.isDown = false;

    console.log(e, this.x, this.y, this.isDown);
  }

  clear(canvas) {
    this.getContext(canvas).clearRect(0, 0, canvas.width, canvas.height);
  }
}

const brush = new Brush("#e66465", 5);

const lineCapItems = [
  {
    label: "butt",
    key: "0",
    icon: <UserOutlined />,
  },
  {
    label: "square",
    key: "1",
    icon: <UserOutlined />,
  },
  {
    label: "round",
    key: "2",
    icon: <UserOutlined />,
  },
];

const lineJoinItems = [
  {
    label: "miter",
    key: "0",
    icon: <UserOutlined />,
  },
  {
    label: "bevel",
    key: "1",
    icon: <UserOutlined />,
  },
  {
    label: "round",
    key: "2",
    icon: <UserOutlined />,
  },
];

export default function Pen({ url }) {
  const contentRef = useRef(null);
  const canvasRef = useRef(null);

  const [thickness, setThickness] = useState(5);
  const [color, setColor] = useState("#fdd835");
  const [shadow, setShadow] = useState(false);
  const [lineCap, setLineCap] = useState(0);
  const [lineJoin, setLineJoin] = useState(0);

  const canvas = new Canvas(canvasRef);

  useEffect(() => {
    canvas.resize(contentRef);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    brush.thickness = thickness;
  }, [thickness]);

  useEffect(() => {
    brush.color = color;
  }, [color]);

  useEffect(() => {
    brush.shadow = shadow;

    console.log(shadow);
  }, [shadow]);

  useEffect(() => {
    brush.lineCap = lineCapItems[lineCap].label;

    console.log(brush.lineCap);
  }, [lineCap]);

  useEffect(() => {
    brush.lineJoin = lineJoinItems[lineJoin].label;

    console.log(brush.lineJoin);
  }, [lineJoin]);

  const handleResize = (e) => {
    // console.log(e.target.innerWidth, e.target.innerHeight);

    canvas.resize(contentRef);
  };

  const handleThicknessChanged = (value) => {
    setThickness(value);
  };

  const handleColorChanged = (e) => {
    console.log(e.target.value);

    setColor(e.target.value);
  };

  const handleShadowChanged = (value) => {
    setShadow(value);
  };

  const handleMenuLineCap = (e) => {
    const key = Number(e.key);

    message.info(`LineCap ${lineCapItems[key].label}`);

    setLineCap(key);

    // console.log(e);
  };

  const handleMenuLineJoin = (e) => {
    const key = Number(e.key);

    message.info(`LineJoin ${lineJoinItems[key].label}`);

    setLineJoin(key);

    // console.log(e);
  };

  const handleClear = (e) => {
    brush.clear(canvasRef.current);
  };

  const handleMouseDown = (e) => {
    brush.mousedown(canvasRef.current, e.nativeEvent);
  };

  const handleMouseUp = (e) => {
    brush.mouseup(canvasRef.current, e.nativeEvent);
  };

  const handleMouseMove = (e) => {
    brush.mousemove(canvasRef.current, e.nativeEvent);
  };

  const handleMouseLeave = (e) => {
    brush.mouseout(canvasRef.current, e.nativeEvent);
  };

  const thicknessStyle = {
    gridColumn: "1 / span 1",
    gridRow: "1 / span 2",
  };

  const colorStyle = {
    gridColumn: "2 / span 1",
    gridRow: "1 / span 1",
  };

  return (
    <div className={styles.root} onResize={handleResize}>
      <div className={styles.menu}>
        <DecoratedSlider style={thicknessStyle} title="Thickness" value={thickness} unit="ø" min={1} max={20} handleChanged={handleThicknessChanged} />
        <ColorPicker style={colorStyle} color={color} handleChanged={handleColorChanged} />
        <Switch className={styles.switch} checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} onChange={handleShadowChanged} />
        <Dropdown className={styles.lineCap} menu={{ items: lineCapItems, onClick: handleMenuLineCap }}>
          <Button>{lineCapItems[lineCap].label}</Button>
        </Dropdown>
        <Dropdown className={styles.lineJoin} menu={{ items: lineJoinItems, onClick: handleMenuLineJoin }}>
          <Button>{lineJoinItems[lineJoin].label}</Button>
        </Dropdown>
        <Button className={styles.button} type="primary" onClick={handleClear}>
          CLEAR
        </Button>
      </div>
      <div ref={contentRef} className={styles.content}>
        <canvas className={styles.canvas} ref={canvasRef} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}></canvas>
      </div>

      {/* <div ref={contentRef} className={styles.content}>
        <canvas className={styles.canvas} ref={canvasRef} onTouchStart={handleMouseDown} onTouchEnd={handleMouseUp} onTouchMove={handleMouseMove} onMouseLeave={handleMouseLeave}></canvas>
      </div> */}
    </div>
  );
}
