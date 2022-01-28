import { DEFAULT_COLOR } from "./Components/colorPicker.util";
import { useState } from "react/cjs/react.development";
import ColorPicker from "./Components/ColorPicker.component";
import "./App.scss";

function App() {
  const [color, setColor] = useState(DEFAULT_COLOR);

  const onSelectColor = (color) => {
    setColor(color);
  };

  return (
    <div
      className="App"
      style={{
        background: `linear-gradient(0deg, #000 55%, ${color} 100%)`,
      }}
    >
      <ColorPicker selectedColor={color} onSelectColor={onSelectColor} />
    </div>
  );
}

export default App;
