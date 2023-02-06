import styles from "./Ellipse.module.css";

import React, { useState, useEffect, useRef } from "react";

import { Button, Switch } from "antd";

import DecoratedSlider from "../../components/DecoratedSlider";
import ColorPicker from "../../components/ColorPicker";

import { Canvas } from "./Canvas";

class Brush {
  constructor(color, thickness) {
    this.color = color;
    this.thickness = thickness;
    this.continuous = false;
    this.x1 = 0;
    this.y1 = 0;
    this.isDown = false;
  }

  getContext(canvas) {
    return canvas.getContext("2d");
  }

  mousedown(canvas, e) {
    e.preventDefault();
    e.stopPropagation();

    //console.log(e.clientX, e.clientY);

    const rect = canvas.getBoundingClientRect();

    this.x1 = e.clientX - rect.left;
    this.y1 = e.clientY - rect.top;

    this.isDown = true;
  }

  mouseup(canvas, e) {
    e.preventDefault();
    e.stopPropagation();

    if (!this.isDown) {
      return;
    }

    this.isDown = false;
  }

  mousemove(canvas, e) {
    e.preventDefault();
    e.stopPropagation();

    if (!this.isDown) {
      return;
    }

    //console.log(e.clientX, e.clientY);

    const rect = canvas.getBoundingClientRect();

    const x2 = e.clientX - rect.left;
    const y2 = e.clientY - rect.top;

    if (!brush.continuous) {
      this.getContext(canvas).clearRect(0, 0, canvas.width, canvas.height);
    }

    this.getContext(canvas).beginPath();
    this.getContext(canvas).strokeStyle = brush.color;
    this.getContext(canvas).lineWidth = this.thickness;
    this.getContext(canvas).moveTo(this.x1, this.y1 + (y2 - this.y1) / 2);
    this.getContext(canvas).bezierCurveTo(this.x1, this.y1, x2, this.y1, x2, this.y1 + (y2 - this.y1) / 2);
    this.getContext(canvas).bezierCurveTo(x2, y2, this.x1, y2, this.x1, this.y1 + (y2 - this.y1) / 2);
    this.getContext(canvas).closePath();
    this.getContext(canvas).stroke();
  }

  mouseout(canvas, e) {
    e.preventDefault();
    e.stopPropagation();

    if (!this.isDown) {
      return;
    }

    this.isDown = false;
  }

  clear(canvas) {
    this.getContext(canvas).clearRect(0, 0, canvas.width, canvas.height);
  }
}

const brush = new Brush("#fdd835", 2);

export default function Ellipse({ url }) {
  const contentRef = useRef(null);
  const canvasRef = useRef(null);

  const [thickness, setThickness] = useState(5);
  const [continuous, setContinuous] = useState(false);
  const [color, setColor] = useState("#fdd835");

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
    brush.continuous = continuous;

    console.log(brush.continuous);
  }, [continuous]);

  useEffect(() => {
    brush.color = color;
  }, [color]);

  const handleResize = (e) => {
    // console.log(e.target.innerWidth, e.target.innerHeight);

    canvas.resize(contentRef);
  };

  const handleThicknessChanged = (value) => {
    setThickness(value);
  };

  const handleContinuousChanged = (value) => {
    setContinuous(value);
  };

  const handleColorChanged = (e) => {
    console.log(e.target.value);

    setColor(e.target.value);
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
    gridRow: "1 / span 1",
  };

  const colorStyle = {
    gridColumn: "2 / span 1",
    gridRow: "1 / span 1",
  };

  return (
    <div className={styles.root} onResize={handleResize}>
      <div className={styles.menu}>
        <DecoratedSlider style={thicknessStyle} title="Thickness" value={thickness} unit="ø" min={1} max={5} handleChanged={handleThicknessChanged} />
        <ColorPicker style={colorStyle} color={color} handleChanged={handleColorChanged} />
        <Switch className={styles.switch} checkedChildren="ON" unCheckedChildren="OFF" onChange={handleContinuousChanged} />
        <Button className={styles.button} type="primary" onClick={handleClear}>
          CLEAR
        </Button>
      </div>
      <div ref={contentRef} className={styles.content}>
        <canvas className={styles.canvas} ref={canvasRef} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}></canvas>
      </div>
    </div>
  );
}
