import styles from "./Circle.module.css";

import React, { useState, useEffect, useRef } from "react";

import { Button, Radio, Dropdown, Space, message } from "antd";

import { DownOutlined, UserOutlined } from "@ant-design/icons";

import DecoratedSlider from "../components/DecoratedSlider";

import { Canvas } from "./Canvas";

class Brush {
  constructor(color, radius, count) {
    this.timer = undefined;
    this.color = color;
    this.radius = radius;
    this.count = count;
  }

  getContext(canvas) {
    return canvas.getContext("2d");
  }

  bg(canvas) {
    const location = {
      cx: canvas.width / 2,
      cy: canvas.height / 2,
    };

    this.getContext(canvas).beginPath();

    this.getContext(canvas).arc(location.cx, location.cy, Math.min(canvas.width / 3, canvas.height / 3), 0, 2 * Math.PI);
    this.getContext(canvas).lineWidth = 1;
    this.getContext(canvas).strokeStyle = "gray";
    this.getContext(canvas).stroke();
    this.getContext(canvas).closePath();

    this.getContext(canvas).beginPath();
    this.getContext(canvas).arc(location.cx, location.cy, 5, 0, 2 * Math.PI);
    this.getContext(canvas).fillStyle = "gray";
    this.getContext(canvas).fill();
    this.getContext(canvas).closePath();
  }

  draw1(canvas, diameter, callback) {
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

    if (++brush.count > 360) {
      brush.count = 0;

      callback("end");
    }
  }

  draw2(canvas, diameter, callback) {
    const r = diameter;
    const theta = Math.random() * 360;
    const cx = r * Math.cos(theta);
    const cy = r * Math.sin(theta);
    const x = canvas.width / 2;
    const y = canvas.height / 2;

    console.log(`cx : ${cx}, cy : ${cy}`);

    this.getContext(canvas).beginPath();
    this.getContext(canvas).arc(x + cx, y + cy, this.radius, 0, 2 * Math.PI);
    this.getContext(canvas).fillStyle = this.color;
    this.getContext(canvas).fill();
    this.getContext(canvas).closePath();

    if (++brush.count > 1000) {
      brush.count = 0;

      callback("end");
    }
  }

  draw3(canvas, diameter, callback) {
    const params = {
      cx: canvas.width / 2,
      cy: canvas.height / 2,
    };

    this.getContext(canvas).beginPath();
    this.getContext(canvas).arc(params.cx, params.cy, this.count, 0, 2 * Math.PI);
    this.getContext(canvas).fillStyle = this.color;
    this.getContext(canvas).fill();

    if (++brush.count > diameter) {
      brush.count = 0;

      callback("end");
    }
  }

  clear(canvas) {
    this.getContext(canvas).clearRect(0, 0, canvas.width, canvas.height);

    this.count = 0;
  }
}

const brush = new Brush("pink", 5, 0);

const items = [
  {
    label: "Circumference",
    key: "0",
    icon: <UserOutlined />,
  },
  {
    label: "Random",
    key: "1",
    icon: <UserOutlined />,
  },
  {
    label: "Radius",
    key: "2",
    icon: <UserOutlined />,
    // danger: true,
  },
];

export default function Circle({ url }) {
  const contentRef = useRef(null);
  const canvasRef = useRef(null);

  const [delay, setDelay] = useState(10);
  const [radius, setRadius] = useState(5);
  const [mode, setMode] = useState("stop");
  const [option, setOption] = useState(0);

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

  useEffect(() => {
    if (mode === "stop") {
      if (brush.timer) {
        clearInterval(brush.timer);
      }
    }
  }, [mode]);

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

  const reset = () => {
    brush.clear(canvasRef.current);

    brush.bg(canvasRef.current);
  };

  const start = () => {
    setMode("start");

    reset();

    brush.timer = setInterval(run, delay, canvasRef, brush, option, setMode);
  };

  const stop = () => {
    setMode("stop");

    reset();
  };

  const handleModeChanged = (e) => {
    console.log(e.target.value);

    // setMode(e.target.value);

    if (e.target.value === "start") {
      start();
    } else {
      stop();
    }
  };

  const handleClear = (e) => {
    reset();
  };

  const handleButtonClick = (e) => {
    // console.log(e);
  };

  const handleMenuClick = (e) => {
    const key = Number(e.key);

    message.info(`Option ${items[key].label}`);

    setOption(Number(e.key));

    stop();

    // Object.assign(items[Number(e.key)], { danger: true });

    // items[Number(e.key)] = {
    //   ...items[Number(e.key)],
    //   danger: true,
    // };

    console.log(items[Number(e.key)]);

    // console.log(items);
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
        <Dropdown className={styles.dropdown} menu={{ items, onClick: handleMenuClick }} onClick={handleButtonClick}>
          <Button>{items[option].label}</Button>
        </Dropdown>
      </div>
      <div ref={contentRef} className={styles.content}>
        <canvas className={styles.canvas} ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

function run(ref, brush, option, setMode) {
  const canvas = ref.current;

  console.log(option);

  if (option === 0) {
    brush.draw1(canvas, Math.min(canvas.width / 3, canvas.height / 3), (msg) => {
      setMode("stop");

      console.log(msg);
    });
  } else if (option === 1) {
    brush.draw2(canvas, Math.min(canvas.width / 3, canvas.height / 3), (msg) => {
      setMode("stop");

      console.log(msg);
    });
  } else if (option === 2) {
    brush.draw3(canvas, Math.min(canvas.width / 3, canvas.height / 3), (msg) => {
      setMode("stop");

      console.log(msg);
    });
  }
}
