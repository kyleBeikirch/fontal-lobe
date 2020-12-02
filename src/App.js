import React, {useEffect, useState, useRef} from 'react';
import './libraries/canvasInput.min'

function App() {
  const [bgColor, setBgColor] = useState('#64a1f0')
  const [textColor, setTextColor] = useState('#000000')
  const [timerOn, setTimerOn] = useState(false)
  const [fontIndex, setFontIndex] = useState(0);
  const canvasRef = useRef(null);
  const canvasInputRef = useRef(null)
  const CCapture = window.CCapture || {}
  var capturer = new CCapture( { format: 'webm', framerate: 60, verbose: true } );

  function toggle() {
    setTimerOn(!timerOn);
  }

  useEffect(() => {
    if (timerOn) {
      var interval = setInterval(() => {
        setFontIndex(fontIndex => fontIndex + 1);
        capturer.start();
        capturer.capture( canvasRef.current );
        capturer.stop();
      },120);
    } else if (!timerOn && fontIndex !== 0) {
      clearInterval(interval);
      capturer.save();
    }
    return () => clearInterval(interval);
  }, [timerOn, fontIndex, setFontIndex]);

  useEffect(() => {
    if(canvasInputRef.current) {
      canvasInputRef.current.fontFamily(`FontalLobe-${fontIndex%3}`)
    }
  }, [fontIndex, canvasInputRef])

  const updateBgColor = (event) => {
    setBgColor(event.target.value)
  }

  const updateTextColor = (event) => {
    setTextColor(event.target.value)
  }

  useEffect(() => {
    canvasInputRef.current = new window.CanvasInput({
      canvas: document.getElementById('canvas'),
      fontFamily: 'FontalLobe-0',
      width: 600,
      height: 400,
      borderWidth: 0,
      boxShadow: 'none',
      backgroundColor: '#64a1f0',
      fontColor: 'black',
      fontSize: 36,
    });
    canvasInputRef.current.focus()
  }, [])

  useEffect(() => {
    canvasInputRef.current.backgroundColor(bgColor)
    canvasInputRef.current.fontColor(textColor)
    document.body.style.backgroundColor = bgColor;
  }, [bgColor, textColor, canvasInputRef])

  return (
    <div className="App">
      <canvas id="canvas" width="600" height="400" ref={canvasRef}/>
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
      <span></span>
      <span className='empty'></span>
    </div>
  );
}

export default App;