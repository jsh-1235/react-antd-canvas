import styles from "./CirclePen.module.css";

import React, { useState, useEffect, useRef } from "react";

import { Button } from "antd";

import ColorPicker from "../components/ColorPicker";

import { Canvas } from "./Canvas";

class Brush {
  constructor(color) {
    this.canvas = undefined;
    this.timer = undefined;

    this.color = color;
    this.x = 0;
    this.y = 0;
    this.isDown = false;
  }

  getContext(canvas) {
    return canvas.getContext("2d");
  }

  getPosition(e) {
    const event = {};

    if (!e) {
      // const e = event;
    }

    if (e.offsetX) {
      event.mouseX = e.offsetX;
      event.mouseY = e.offsetY;
    } else if (e.layerX) {
      event.mouseX = e.layerX;
      event.mouseY = e.layerY;
    }

    return event;
  }

  reset() {
    if (this.timer != null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  mousedown(canvas, e) {
    e.preventDefault();
    e.stopPropagation();

    const xy = this.getPosition(e);

    this.x = xy.mouseX;
    this.y = xy.mouseY;

    this.isDown = true;

    if (this.timer == null) {
      this.timer = setInterval(draw, 50, this.canvas);
    }
  }

  mouseup(canvas, e) {
    e.preventDefault();
    e.stopPropagation();

    if (!this.isDown) {
      return;
    }

    this.isDown = false;

    // this.reset();
  }

  mousemove(canvas, e) {
    e.preventDefault();
    e.stopPropagation();

    if (!this.isDown) {
      return;
    }

    const xy = this.getPosition(e);

    this.x = xy.mouseX;
    this.y = xy.mouseY;

    // console.log(this.x, this.y);
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

let count = 0;

function draw(canvas) {
  if (brush.isDown === true) {
    count++;
  } else {
    count = 0;

    brush.reset();
  }

  brush.getContext(canvas).beginPath();
  brush.getContext(canvas).arc(brush.x - 0, brush.y - 0, count, 0, 2 * Math.PI);
  brush.getContext(canvas).fillStyle = brush.color;
  brush.getContext(canvas).fill();

  console.log(`count : ${count}`);
}

const brush = new Brush("#fdd835");

export default function CirclePen({ url }) {
  const contentRef = useRef(null);
  const canvasRef = useRef(null);

  const [color, setColor] = useState(brush.color);

  const canvas = new Canvas(canvasRef);

  useEffect(() => {
    canvas.resize(contentRef);

    brush.canvas = canvasRef.current;

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      brush.reset();

      count = 0;
    };
  }, []);

  useEffect(() => {
    brush.color = color;
  }, [color]);

  const handleResize = (e) => {
    // console.log(e.target.innerWidth, e.target.innerHeight);

    canvas.resize(contentRef);
  };

  const handleColorChanged = (e) => {
    console.log(e.target.value);

    setColor(e.target.value);
  };

  const handleClear = (e) => {
    brush.clear(canvasRef.current);

    count = 0;
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

  const colorStyle = {
    gridColumn: "1 / span 1",
    gridRow: "1 / span 1",
    alignSelf: "center",
    justifySelf: "start",
  };

  return (
    <div className={styles.root} onResize={handleResize}>
      <div className={styles.menu}>
        <ColorPicker style={colorStyle} color={color} handleChanged={handleColorChanged} />
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
