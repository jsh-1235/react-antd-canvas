import styles from "./Point.module.css";

import React, { useState, useEffect, useRef } from "react";

import { Button } from "antd";

import DecoratedSlider from "../components/DecoratedSlider";
import ColorPicker from "../components/ColorPicker";

import { Canvas } from "./Canvas";

export default function Point({ url }) {
  const contentRef = useRef(null);
  const canvasRef = useRef(null);

  const [radius, setRadius] = useState(10);
  const [color, setColor] = useState("#fdd835");

  const canvas = new Canvas(canvasRef);

  useEffect(() => {
    canvas.resize(contentRef);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleResize = (e) => {
    // console.log(e.target.innerWidth, e.target.innerHeight);

    canvas.resize(contentRef);
  };

  const handleChanged = (value) => {
    setRadius(value);
  };

  const handleColorChanged = (e) => {
    console.log(e.target.value);

    setColor(e.target.value);
  };

  const handleClear = (e) => {
    canvas.clear();
  };

  const handleMouseDown = (e) => {
    e.preventDefault();

    run(canvasRef, color, radius, e);
  };

  return (
    <div className={styles.root} onResize={handleResize}>
      <div className={styles.menu}>
        <DecoratedSlider title="Radius" value={radius} unit="ø" min={0} max={100} handleChanged={handleChanged} />
        <ColorPicker color={color} handleChanged={handleColorChanged} />
        <Button className={styles.button} type="primary" onClick={handleClear}>
          CLEAR
        </Button>
      </div>
      <div ref={contentRef} className={styles.content}>
        <canvas className={styles.canvas} ref={canvasRef} onMouseDown={handleMouseDown}></canvas>
      </div>
    </div>
  );
}

function run(ref, color, radius, e) {
  const canvas = ref.current;

  const context = canvas.getContext("2d");

  const rect = canvas.getBoundingClientRect();

  const coordinate = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };

  context.beginPath();
  context.fillStyle = color;
  context.arc(coordinate.x, coordinate.y, radius, 0, 2 * Math.PI);
  context.fill();
}
