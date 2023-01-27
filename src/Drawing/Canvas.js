export class Canvas {
  constructor(ref) {
    this.ref = ref;

    this.canvas = null;

    this.context = null;
  }

  resize(contentRef) {
    this.getCanvas();

    const footer = getComputedStyle(document.querySelector(":root")).getPropertyValue("--footer-hight").split("px")[0];

    console.log(window.innerWidth, window.innerHeight, contentRef.current.getBoundingClientRect().left, contentRef.current.getBoundingClientRect().top, footer);

    this.canvas.width = window.innerWidth - contentRef.current.getBoundingClientRect().left;
    this.canvas.height = window.innerHeight - contentRef.current.getBoundingClientRect().top - footer;

    this.boundary();
  }

  getCanvas() {
    this.canvas = this.ref.current;
  }

  getContext() {
    this.getCanvas();

    this.context = this.canvas.getContext("2d");
  }

  boundary() {
    this.getContext();

    this.context.beginPath();
    this.context.lineWidth = "1";
    this.context.strokeStyle = "#bcbcbc";
    this.context.rect(0, 0, this.canvas.width, this.canvas.height);
    this.context.stroke();
  }

  clear() {
    this.getContext();

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.boundary();
  }
}

export const Graphics = {
  randomColor: function () {
    const r = (255 * Math.random()) | 0;
    const g = (255 * Math.random()) | 0;
    const b = (255 * Math.random()) | 0;

    return `rgb(${r}, ${g}, ${b})`;
  },
};
