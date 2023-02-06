import styles from "./Random.module.css";

import React, { useState, useEffect, useRef } from "react";

import { Button, Radio } from "antd";

import DecoratedSlider from "../../components/DecoratedSlider";

import { Canvas, Graphics } from "./Canvas";

const marks = {
  0: {
    style: {
      color: "#0000009A",
    },
    label: <span>0</span>,
  },
  1000: {
    style: {
      color: "#0000009A",
    },
    label: <span>1000</span>,
  },
};

let timer = null;

export default function Random({ url }) {
  const contentRef = useRef(null);
  const canvasRef = useRef(null);

  const [delay, setDelay] = useState(100);
  const [mode, setMode] = useState("stop");

  const canvas = new Canvas(canvasRef);

  useEffect(() => {
    canvas.resize(contentRef);

    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(timer);

      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleResize = (e) => {
    // console.log(e.target.innerWidth, e.target.innerHeight);

    canvas.resize(contentRef);
  };

  const handleChanged = (value) => {
    setDelay(value);
  };

  const handleModeChanged = (e) => {
    console.log(e.target.value);

    setMode(e.target.value);

    if (e.target.value === "start") {
      timer = setInterval(run, delay, canvasRef);
    } else {
      clearInterval(timer);
    }
  };

  const handleClear = (e) => {
    canvas.clear();
  };

  return (
    <div className={styles.root} onResize={handleResize}>
      <div className={styles.menu}>
        <DecoratedSlider title="Delay" value={delay} unit="ms" min={0} max={1000} step={10} marks={marks} mode={mode} handleChanged={handleChanged} />
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

function run(ref) {
  const canvas = ref.current;

  const context = canvas.getContext("2d");

  const cx = canvas.width * Math.random();
  const cy = canvas.height * Math.random();

  const radius = Math.floor(Math.random() * 100 + 1); // 1 ~ 100

  const color = Graphics.randomColor();

  const coordinate = {
    x: cx,
    y: cy,
  };

  context.beginPath();
  context.fillStyle = color;
  context.arc(coordinate.x, coordinate.y, radius, 0, 2 * Math.PI);
  context.fill();
}
