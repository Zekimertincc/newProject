

import * as Tone from "tone";

import './App.css'


function App() {
  

  return (

    
    <>
    <button onClick={ async () => {
      await Tone.start();
      console.log("audio is ready");
    }}>Tıkla</button>
    </>
  )
}

export default App
