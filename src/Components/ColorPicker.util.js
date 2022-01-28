export const CANVAS_SIZE = 320;
export const CANVAS_COLOR_SELECTOR_HEIGHT = 20;
export const DEFAULT_COLOR = "#000000";

export const isColorValid = (color) => CSS.supports("color", color);

export const rgbToHex = (r, g, b) => {
  if (r > 255 || g > 255 || b > 255) throw "Invalid color component";
  return ((r << 16) | (g << 8) | b).toString(16);
};

export const readPixelColor = (event, colorCtx) => {
  let hexColor = "#ffffff";
  if (colorCtx) {
    const x = event.pageX - event.target.offsetLeft; // Get X coordinate inside canvas
    const y = event.pageY - event.target.offsetTop; // Get Y coordinate inside canvas
    const pixel = colorCtx.getImageData(x, y, 1, 1).data; // Read pixel Color
    hexColor =
      "#" + ("000000" + rgbToHex(pixel[0], pixel[1], pixel[2])).slice(-6);
  }
  return hexColor;
};
