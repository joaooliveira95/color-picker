import cn from "classnames";
import { CANVAS_SIZE, CANVAS_COLOR_SELECTOR_HEIGHT, isColorValid, readPixelColor, DEFAULT_COLOR } from "./colorPicker.util";
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import "./colorPicker.styles.scss";

const ColorPicker = ({
  defaultColor = DEFAULT_COLOR,
  canvasSize = CANVAS_SIZE,
  canvasColorSelectorHeight = CANVAS_COLOR_SELECTOR_HEIGHT,
}) => {
  const colorCanvasRef = useRef();
  const colorSelectorCanvasRef = useRef();
  const [color, setColor] = useState(defaultColor);
  const [selectedColor, setSelectedColor] = useState(defaultColor);

  const buildColorCanvas = () => {
    const currentCanvas = colorCanvasRef?.current;

    try {
      // This create a 2D context for the canvas
      const colorCtx = currentCanvas.getContext("2d"); 
      // Create an horizontal gradient
      let gradientH = colorCtx.createLinearGradient(0, 0, currentCanvas.width, 0);
      gradientH.addColorStop(0, "#fff");
      gradientH.addColorStop(1, color);
      colorCtx.fillStyle = gradientH;
      colorCtx.fillRect(0, 0, currentCanvas.width, currentCanvas.height);

      // Create a Vertical Gradient(white to black)
      let gradientV = colorCtx.createLinearGradient(0, 0, 0, currentCanvas.height);
      gradientV.addColorStop(0, "rgba(0,0,0,0)");
      gradientV.addColorStop(1, "#000");
      colorCtx.fillStyle = gradientV;
      colorCtx.fillRect(0, 0, currentCanvas.width, currentCanvas.height);
    } catch (error) {
      console.log("Invalid color");
    }
  };

  const buildColorSelectorCanvas = () => {
    const currentCanvas = colorSelectorCanvasRef?.current;

    try {
      // This create a 2D context for the canvas
      const colorCtx = currentCanvas?.getContext("2d");
      // Create an horizontal gradient
      let gradientH = colorCtx.createLinearGradient(0, 0, currentCanvas.width, 0 );
      gradientH.addColorStop(0, "#ff0000");
      gradientH.addColorStop(0.333, "#0000ff");
      gradientH.addColorStop(0.666, "#00ff00");
      gradientH.addColorStop(0.831, "#ffff00");
      gradientH.addColorStop(1, "#ff0000");
      colorCtx.fillStyle = gradientH;
      colorCtx.fillRect(0, 0, currentCanvas.width, currentCanvas.height);
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
    setSelectedColor(value);
    buildColorCanvas();
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
        id="color_canvas"
        ref={colorCanvasRef}
        width={canvasSize}
        height={canvasSize}
        onClick={onColorCanvasClick}
      />
      <canvas
        id="color_selector_canvas"
        ref={colorSelectorCanvasRef}
        width={canvasSize}
        height={canvasColorSelectorHeight}
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
  canvasSize: PropTypes.number,
  canvasSelectorHeight: PropTypes.number,
  defaultColor: PropTypes.string,
};

export default ColorPicker;
