import React, {useEffect, useState, useRef} from 'react';
import './libraries/canvasInput.min'

function App() {
  const [bgColor, setBgColor] = useState('#64a1f0')
  const [textColor, setTextColor] = useState('#000000')
  const [timerOn, setTimerOn] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [fontIndex, setFontIndex] = useState(0);
  const canvasRef = useRef(null);
  const canvasInputRef = useRef(null)
  const mediaRecorder = useRef(null)

  function toggle() {
    setTimerOn(!timerOn);
    if(!timerOn){
      mediaRecorder.current.start();
    }
  }

  useEffect(() => {
    if (timerOn) {
      var interval = setInterval(() => {
        setFontIndex(fontIndex => fontIndex + 1);
      },120);
    } else if (!timerOn && fontIndex !== 0) {
      clearInterval(interval);
      mediaRecorder.current.stop();
    }
    return () => clearInterval(interval);
  }, [timerOn, fontIndex, setFontIndex, mediaRecorder]);

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
      value: 'Type with brains behind its face.',
      fontSize: 36,
    });
    canvasInputRef.current.focus()
    var canvas = document.querySelector("canvas");
    var video = document.querySelector("video");
    var videoStream = canvas.captureStream(30);
    mediaRecorder.current = new MediaRecorder(videoStream);
    var chunks = [];
    mediaRecorder.current.ondataavailable = function(e) {
      chunks.push(e.data);
    };

    mediaRecorder.current.onstop = function(e) {
      var blob = new Blob(chunks, { 'type' : 'video/mp4' });
      chunks = [];
      var videoURL = URL.createObjectURL(blob);
      video.src = videoURL;
      setShowVideo(true)
    };
    mediaRecorder.current.ondataavailable = function(e) {
      chunks.push(e.data);
    };
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
      <video autoPlay controls style={{display: showVideo ? 'block' : 'none'}}></video>
      <span></span>
      <span className='empty'></span>
    </div>
  );
}

export default App;