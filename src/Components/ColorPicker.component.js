import cn from "classnames";
import { isColorValid, readPixelColor } from "./colorPicker.util";
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

import "./colorPicker.styles.scss";

const CANVAS_SIZE = 400;
const COLOR_SELECTOR_CANVAS_HEIGHT = 20;

const ColorPicker = ({ defaultColor = "#000000" }) => {
  const colorCanvasRef = useRef();
  const colorSelectorCanvasRef = useRef();
  const [color, setColor] = useState(defaultColor);
  const [selectedColor, setSelectedColor] = useState(defaultColor);

  const buildColorCanvas = () => {
    try {
      colorCanvasRef.current.width = CANVAS_SIZE;
      colorCanvasRef.current.height = CANVAS_SIZE;
      const colorCtx = colorCanvasRef.current.getContext("2d"); // This create a 2D context for the canvas

      // Create an horizontal gradient
      let gradientH = colorCtx.createLinearGradient(0, 0, CANVAS_SIZE, 0);
      gradientH.addColorStop(0, "#fff");
      gradientH.addColorStop(1, color);
      colorCtx.fillStyle = gradientH;
      colorCtx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Create a Vertical Gradient(white to black)
      let gradientV = colorCtx.createLinearGradient(0, 0, 0, CANVAS_SIZE);
      gradientV.addColorStop(0, "rgba(0,0,0,0)");
      gradientV.addColorStop(1, "#000");
      colorCtx.fillStyle = gradientV;
      colorCtx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    } catch (error) {
      console.log("Invalid color");
    }
  };

  const buildColorSelectorCanvas = () => {
    try {
      colorSelectorCanvasRef.current.width = CANVAS_SIZE;
      colorSelectorCanvasRef.current.height = COLOR_SELECTOR_CANVAS_HEIGHT;
      const colorCtx = colorSelectorCanvasRef?.current?.getContext("2d"); // This create a 2D context for the canvas

      // Create an horizontal gradient
      let gradientH = colorCtx.createLinearGradient(0, 0, colorSelectorCanvasRef.current.width, 0);
      gradientH.addColorStop(0, "#ff0000");
      gradientH.addColorStop(0.333, "#0000ff");
      gradientH.addColorStop(0.666, "#00ff00");
      gradientH.addColorStop(0.831, "#ffff00");
      gradientH.addColorStop(1, "#ff0000");
      colorCtx.fillStyle = gradientH;
      colorCtx.fillRect(0, 0, colorSelectorCanvasRef.current.width, colorSelectorCanvasRef.current.height);
    } catch (error) {
      console.log("Invalid color");
    }
  };

  useEffect(() => {
    buildColorSelectorCanvas();
  }, []);

  useEffect(() => {
    if (isColorValid(color)) {
      buildColorCanvas();
    }
  }, [color]);

  const onInputChange = (event) => {
    const { value } = event.target;
    setColor(value);
    buildColorCanvas(value);
    setSelectedColor(value);
  };

  const onColorCanvasClick = (event) => {
    const colorCtx = colorCanvasRef?.current?.getContext("2d");
    const hexColor = readPixelColor(event, colorCtx);

    if (isColorValid(hexColor)) {
      setSelectedColor(hexColor);
    }
  };

  const onColorSelectorCanvasClick = (event) => {
    const colorCtx = colorSelectorCanvasRef?.current?.getContext("2d");
    const hexColor = readPixelColor(event, colorCtx);

    if (isColorValid(hexColor)) {
      setColor(hexColor);
      setSelectedColor(hexColor);
    }
  };

  return (
    <div className="color-picker">
      <canvas
        ref={colorCanvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        onClick={onColorCanvasClick}
      />
      <canvas
        ref={colorSelectorCanvasRef}
        width={CANVAS_SIZE}
        height={20}
        onClick={onColorSelectorCanvasClick}
      />
      <div
        className="color-picker__selected-color"
        style={{ background: selectedColor }}
      >
        <h1>{selectedColor}</h1>
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

ColorPicker.propTypes = {
  defaultColor: PropTypes.string,
};

export default ColorPicker;
