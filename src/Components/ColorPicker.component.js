import cn from "classnames";
import { isColorValid, rgbToHex } from "./ColorPicker.util";
import { useEffect, useRef, useState } from "react";
import "./colorPicker.styles.scss";

const CANVAS_SIZE = 400;

const ColorPicker = ({ defaultColor = "#000000" }) => {
  const ref = useRef();
  const [color, setColor] = useState(defaultColor);
  const [selectedColor, setSelectedColor] = useState(defaultColor);

  const updateCanvas = () => {
    try {
      ref.current.width = CANVAS_SIZE;
      ref.current.height = CANVAS_SIZE;
      const ColorCtx = ref.current.getContext("2d"); // This create a 2D context for the canvas

      // Create a horizontal gradient
      let gradientH = ColorCtx.createLinearGradient(0, 0, CANVAS_SIZE, 0);
      gradientH.addColorStop(0, "#fff");
      gradientH.addColorStop(1, color);
      ColorCtx.fillStyle = gradientH;
      ColorCtx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Create a Vertical Gradient(white to black)
      let gradientV = ColorCtx.createLinearGradient(0, 0, 0, CANVAS_SIZE);
      gradientV.addColorStop(0, "rgba(0,0,0,0)");
      gradientV.addColorStop(1, "#000");
      ColorCtx.fillStyle = gradientV;
      ColorCtx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    } catch (error) {
      console.log("Invalid color");
    }
  };

  useEffect(() => {
    if (isColorValid(color)) {
      updateCanvas();
    }
  }, [color]);

  const onInputChange = (event) => {
    const { value } = event.target;
    setColor(value);
    updateCanvas(value);
    setSelectedColor(value);
  };

  const onCanvasClick = (event) => {
    const ColorCtx = ref.current.getContext("2d");
    if (ref?.current && ColorCtx) {
      const x = event.pageX - event.target.offsetLeft; // Get X coordinate inside canvas
      const y = event.pageY - event.target.offsetTop; // Get Y coordinate inside canvas
      const pixel = ColorCtx.getImageData(x, y, 1, 1).data; // Read pixel Color
      const rgb = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
      const hex =
        "#" + ("000000" + rgbToHex(pixel[0], pixel[1], pixel[2])).slice(-6);
      console.log(rgb, hex);
      if (isColorValid(hex)) {
        setSelectedColor(hex);
      }
    }
  };

  return (
    <div className="color-picker">
      <canvas
        ref={ref}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        id="color_canvas"
        onClick={onCanvasClick}
      />
      <div
        className="color-picker__selected-color"
        style={{ background: selectedColor }}
      >
        <h1 style={{ background: "rgba(255,255,255,0.5)", maxWidth: 250 }}>
          {selectedColor}
        </h1>
      </div>
      <div
        className={cn({
          "color-picker__input": true,
          "color-picker__input--error": !isColorValid(color),
        })}
      >
        <span>Color (HEX):</span>
        <input type="text" value={color} onChange={onInputChange}></input>
      </div>
    </div>
  );
};

export default ColorPicker;
