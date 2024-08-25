import React, { useEffect, useRef, useState } from 'react';
import './Test.css'


const Test = () => {

  let i = 0;
  function makeProgress() {
      if(i < 100){
          i++;
          document.querySelector('.progress-bar').style.width = i + '%';
          document.querySelector('.progress-bar').textContent = i + ' %';
      }
      // Wait for sometime before running this script again
      setTimeout(makeProgress, 200);
  }

  function test11() {
    console.log('qwdqwdqw')
  }

  useEffect(() => {
    makeProgress()
    test11()
  }, [])


  return (
    <div className="container">
      <h3>Animated Progress Bar</h3>
      <div className="progress">
        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style={{width : '75%'}}></div>
      </div>
    </div>
  );
};

export default Test;