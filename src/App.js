import React, {useEffect, useState, useRef} from 'react';
import './libraries/canvasInput.min'
import CCapture from 'ccapture.js'

function App() {
  const fontFamilies = ['FontalLobe', 'Arial', "Times New Roman"]
  const [bgColor, setBgColor] = useState('#64a1f0')
  const [textColor, setTextColor] = useState('#000000')
  const [timerOn, setTimerOn] = useState(false)
  const [fontIndex, setFontIndex] = useState(0);
  const canvasRef = useRef(null);
  const captureRef = useRef(null);
  const capturer = new CCapture( { format: 'webm', framerate: 60, verbose: true } );

  function toggle() {
    setTimerOn(!timerOn);
  }

  useEffect(() => {
    let interval = null;
    if (timerOn) {
      capturer.start();
      interval = setInterval(() => {
        setFontIndex(fontIndex => fontIndex + 1);
        capturer.capture( canvasRef.current );
      }, 120);
    } else if (!timerOn && fontIndex !== 0) {
      clearInterval(interval);
      capturer.stop();
      capturer.save();
    }
    return () => clearInterval(interval);
  }, [timerOn, fontIndex]);

  useEffect(() => {
    if(canvasRef.current) {
      canvasRef.current.fontFamily(fontFamilies[fontIndex%3])
    }
  }, [fontIndex, canvasRef])

  const updateBgColor = (event) => {
    setBgColor(event.target.value)
  }

  const updateTextColor = (event) => {
    setTextColor(event.target.value)
  }

  useEffect(() => {
    canvasRef.current = new window.CanvasInput({
      canvas: document.getElementById('canvas'),
      fontFamily: 'FontalLobe',
      width: 600,
      height: 400,
      borderWidth: 0,
      boxShadow: 'none',
      backgroundColor: bgColor,
      fontColor: 'black',
      fontSize: 36,
    });
    canvasRef.current.focus()
  }, [])

  useEffect(() => {
    canvasRef.current.backgroundColor(bgColor)
    canvasRef.current.fontColor(textColor)
    document.body.style.backgroundColor = bgColor;
  }, [bgColor, textColor, canvasRef])

  return (
    <div className="App">
      <canvas id="canvas" width="600" height="400"></canvas>
      <button onClick={toggle}>
        {timerOn ? 'Pause' : 'Start'}
      </button>
      <p>Choose your colors</p>

      <div>
        <input type="color" id="bg" name="bg"
               value={bgColor} onChange={updateBgColor}/>
          <label htmlFor="head">Background</label>
      </div>

      <div>
        <input type="color" id="text" name="text"
               value={textColor} onChange={updateTextColor}/>
          <label htmlFor="body">Text</label>
      </div>
    </div>
  );
}

export default App;