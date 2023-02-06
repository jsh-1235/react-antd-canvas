import styles from "./Rotate.module.css";

import React, { useState, useEffect, useRef } from "react";

import { Button, Radio } from "antd";

import DecoratedSlider from "../../components/DecoratedSlider";

import { Canvas } from "./Canvas";

const brush = new Brush("orange", 10, 0);

export default function Rotate({ url }) {
  const contentRef = useRef(null);
  const canvasRef = useRef(null);

  const [delay, setDelay] = useState(10);
  const [radius, setRadius] = useState(10);
  const [mode, setMode] = useState("stop");

  const canvas = new Canvas(canvasRef);

  useEffect(() => {
    canvas.resize(contentRef);

    brush.bg(canvasRef.current);

    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(brush.timer);

      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    brush.radius = radius;
  }, [radius]);

  const handleResize = (e) => {
    // console.log(e.target.innerWidth, e.target.innerHeight);

    canvas.resize(contentRef);

    brush.bg(canvasRef.current);
  };

  const handleDelayChanged = (value) => {
    setDelay(value);
  };

  const handleRadiusChanged = (value) => {
    setRadius(value);
  };

  const handleModeChanged = (e) => {
    console.log(e.target.value);

    setMode(e.target.value);

    if (e.target.value === "start") {
      brush.timer = setInterval(run, delay, canvasRef, brush);
    } else {
      clearInterval(brush.timer);
    }
  };

  const handleClear = (e) => {
    canvas.clear();

    brush.bg(canvasRef.current);
  };

  const delayStyle = {
    gridColumn: "1 / span 1",
    gridRow: "1 / span 1",
  };

  const radiusStyle = {
    gridColumn: "1 / span 1",
    gridRow: "2 / span 1",
  };

  return (
    <div className={styles.root} onResize={handleResize}>
      <div className={styles.menu}>
        <DecoratedSlider style={delayStyle} title="Delay" value={delay} unit="ms" min={0} max={1000} step={10} mode={mode} handleChanged={handleDelayChanged} />
        <DecoratedSlider style={radiusStyle} title="Radius" value={radius} unit="ø" min={0} max={100} handleChanged={handleRadiusChanged} />
        <Radio.Group className={styles.radio} buttonStyle="solid" defaultValue="stop" value={mode} onChange={handleModeChanged}>
          <Radio.Button value="start">Start</Radio.Button>
          <Radio.Button value="stop">Stop</Radio.Button>
        </Radio.Group>
        <Button className={styles.button} type="primary" onClick={handleClear}>
          CLEAR
        </Button>
      </div>
      <div ref={contentRef} className={styles.content}>
        <canvas className={styles.canvas} ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

function run(ref, brush) {
  const canvas = ref.current;

  const max = Math.min(canvas.width / 3, canvas.height / 3);

  brush.clear(canvas);

  brush.bg(canvas);

  brush.draw(canvas, max / 3);

  brush.draw(canvas, (max * 2) / 3);

  brush.draw(canvas, max);

  if (++brush.count > 360) {
    brush.count = 0;
  }
}

function Brush(color, radius, count) {
  this.timer = undefined;
  this.color = color;
  this.radius = radius;
  this.count = count;
}

Brush.prototype.getContext = function (canvas) {
  return canvas.getContext("2d");
};

Brush.prototype.bg = function (canvas) {
  const location = {
    cx: canvas.width / 2,
    cy: canvas.height / 2,
  };

  this.getContext(canvas).beginPath();

  this.getContext(canvas).arc(location.cx, location.cy, Math.min(canvas.width / 3, canvas.height / 3), 0, 2 * Math.PI);
  this.getContext(canvas).lineWidth = 2;
  this.getContext(canvas).strokeStyle = "gray";
  this.getContext(canvas).stroke();
  this.getContext(canvas).closePath();

  this.getContext(canvas).beginPath();
  this.getContext(canvas).arc(location.cx, location.cy, 20, 0, 2 * Math.PI);
  this.getContext(canvas).fillStyle = "black";
  this.getContext(canvas).fill();
  this.getContext(canvas).closePath();

  this.getContext(canvas).font = "16px Arial";
  this.getContext(canvas).fillStyle = "white";
  this.getContext(canvas).textBaseline = "middle";
  this.getContext(canvas).textAlign = "center";
  this.getContext(canvas).fillText(this.count, location.cx, location.cy);
};

Brush.prototype.draw = function (canvas, diameter) {
  const r = diameter;
  const cx = r * Math.cos((this.count * Math.PI) / 180);
  const cy = r * Math.sin((this.count * Math.PI) / 180);
  const x = canvas.width / 2;
  const y = canvas.height / 2;
  console.log(`cx : ${cx}, cy : ${cy}`);

  this.getContext(canvas).beginPath();
  this.getContext(canvas).arc(x + cx, y + cy, this.radius, 0, 2 * Math.PI);
  this.getContext(canvas).fillStyle = this.color;
  this.getContext(canvas).fill();
  this.getContext(canvas).closePath();
};

Brush.prototype.clear = function (canvas) {
  this.getContext(canvas).clearRect(0, 0, canvas.width, canvas.height);
};
