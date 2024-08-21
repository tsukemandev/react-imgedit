//import logo from './logo.svg';
import './App.css';

import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

function App() {
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const buttonRef = useRef(null)
  const buttonRef2 = useRef(null)
  const resetButtonRef = useRef(null)

  const isNavbarVisible = useRef(false); // useState 대신 useRef로 관리
  const navbarRef = useRef(null);


  var originalFile;
  var imgObj
  var canvas
  var scaleFactor

  var originalWidth
  var originalHeight

  //const imgEl = useRef(null)
  const options = {
    backgroundColor: 'rgb(18,18,36)',
    selectionColor: 'blue',
    // 추가 옵션들...
  };


  useEffect(() => {

    applyFilterBackend()

    const eventFunc = function (event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = function (e) {

        //canvas = new fabric.Canvas('myCanvas', options);

        fabric.Image.fromURL(e.target.result, function (img) {
          if (imgObj) {
            canvas.dispose();
          }


          originalWidth = img.width;
          originalHeight = img.height;

          originalFile = new fabric.Image(e.target.result)
          // 새로운 캔버스를 생성합니다.
          canvas = new fabric.Canvas('myCanvas', options);

          canvasRef.current.style.display = 'block';
          resetButtonRef.current.style.display = 'block'
          buttonRef.current.style.display = 'none'
          buttonRef2.current.style.display = ''

          // 이미지 설정
          img.set({
            left: 0,
            top: 0,
            angle: 0,
            opacity: 0.85,
            selectable: false, // 선택 불가능하게 설정
          });





          // 현재 뷰포트 크기 가져오기
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;

          // 원하는 캔버스 크기 계산 (예: 뷰포트의 80% 크기로 설정)
          const maxCanvasWidth = viewportWidth * 0.8;
          const maxCanvasHeight = viewportHeight * 0.8;

          // 이미지의 원본 크기와 비교하여 스케일 계산
          const scaleX = maxCanvasWidth / originalWidth;
          const scaleY = maxCanvasHeight / originalHeight;

          // 이미지가 뷰포트에 맞게끔 가장 작은 스케일 값 사용
          scaleFactor = Math.min(scaleX, scaleY);

          img.scale(scaleFactor); // 스케일링 적용






          imgObj = img;
          canvas.add(img);
          //canvas.add(el);

          // 캔버스의 크기를 이미지의 크기에 맞게 조정
          canvas.setWidth(originalWidth * scaleFactor);
          canvas.setHeight(originalHeight * scaleFactor);

          console.log('original : ' + originalFile.width + ' copy : ' + img.width)

          // 이미지 캔버스 중앙에 배치
          canvas.centerObject(img);
          canvas.renderAll();
        });

      }
      if (file) {
        reader.readAsDataURL(file);
      }
    }

    document.getElementById('imageInput').addEventListener('change', eventFunc);

    return () => {
      document.getElementById('imageInput').removeEventListener('change', eventFunc)
    };
  }, []);


  // ##########################################

  function filterTest() {
    if (imgObj) {
      const obj = canvas.getActiveObject()
      console.log('?? : ' + obj == imgObj)
    }
  }

  const toggleNavbar = (e) => {
    e.preventDefault()

    isNavbarVisible.current = !isNavbarVisible.current;
    if (navbarRef.current) {
      if (isNavbarVisible.current) {
        navbarRef.current.classList.add('visible-navbar');
        navbarRef.current.classList.remove('hidden-navbar');
      } else {
        navbarRef.current.classList.add('hidden-navbar');
        navbarRef.current.classList.remove('visible-navbar');
      }
    }
  };


  function applyFilterBackend() {
    console.log('applied filter backend')
    fabric.filterBackend = new fabric.Canvas2dFilterBackend()
  }





  function setGrayScale(style = 'average') {
    if (imgObj) {
      if (!style) {
        imgObj.filters = imgObj.filters.filter(filter => filter.type !== 'Grayscale')
        imgObj.applyFilters();
        canvas.renderAll()
        return
      }
      const filter = new fabric.Image.filters.Grayscale({ mode: style })
      imgObj.filters = imgObj.filters.filter(filter => filter.type !== 'Grayscale')
      imgObj.filters.push(filter)
      imgObj.applyFilters();
      canvas.renderAll()
    }
    //applyFilter(0, this.checked && new f.Grayscale())
  }


  function setInvert() {
    if (imgObj) {
      const filter = new fabric.Image.filters.Invert()
      imgObj.filters.push(filter)
      imgObj.applyFilters()
      canvas.renderAll()
    }
  }


  function setSepia() {
    if (imgObj) {
      const filter = new fabric.Image.filters.Sepia()

      const findObj = imgObj.filters.find(filter => filter.type === 'Sepia')
      if (findObj) {
        imgObj.filters = imgObj.filters.filter(filter => filter.type !== 'Sepia')
        imgObj.applyFilters();
        canvas.renderAll()
        return
      }

      imgObj.filters.push(filter)
      imgObj.applyFilters()
      canvas.renderAll()
    }
  }

  function setContrast(contrast = 0.25) {
    if (imgObj) {
      const filter = new fabric.Image.filters.Contrast({
        contrast: contrast
      });
      const findObj = imgObj.filters.find(filter => filter.type === 'Contrast')
      if (findObj) {

        imgObj.filters = imgObj.filters.filter(filter => filter.type !== 'Contrast')

        if (findObj.contrast === contrast) {
          imgObj.applyFilters();
          canvas.renderAll()
          return
        }
      }

      imgObj.filters.push(filter)
      imgObj.applyFilters()
      canvas.renderAll()
    }
  }

  function setBlur(blur = 0.5) {
    if (imgObj) {
      const filter = new fabric.Image.filters.Blur({
        blur: blur
      })

      const findObj = imgObj.filters.find(filter => filter.type === 'Blur')
      if (findObj) {
        imgObj.filters = imgObj.filters.filter(filter => filter.type !== 'Blur')

        if (findObj.blur === blur) {
          imgObj.applyFilters();
          canvas.renderAll()
          return
        }
      }

      imgObj.filters.push(filter)
      imgObj.applyFilters()
      canvas.renderAll()
    }
  }

  function setBrightness(brightness = 0.05) {

    console.log('brightness : ' + brightness)

    if (imgObj) {
      // 기존 밝기 필터 제거
      imgObj.filters = imgObj.filters.filter(filter => filter.type !== 'Brightness');

      const filter = new fabric.Image.filters.Brightness({
        brightness: brightness
      });

      imgObj.filters.push(filter);
      imgObj.applyFilters();
      canvas.renderAll();
    }
  }

  function reset() {
    imgObj.filters = []
    imgObj.applyFilters();
    canvas.renderAll();
  }

  function saveAsJPG(e) {
    e.preventDefault();

    if (imgObj) {

      imgObj.scale(1)
      canvas.setWidth(originalWidth)
      canvas.setHeight(originalHeight)

      // 캔버스 내용을 JPG 형식의 데이터 URL로 변환합니다.
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1, // 이미지 품질 (0에서 1 사이, 1이 최고 품질)
      });

      // 링크 요소를 생성하여 다운로드를 트리거합니다.
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'canvas-image.jpg'; // 저장할 파일 이름
      link.click(); // 다운로드 실행


      imgObj.scale(scaleFactor)
      canvas.setWidth(originalWidth * scaleFactor)
      canvas.setHeight(originalHeight * scaleFactor)
    }
  }


  return (
    <div>

      <div className="navbar">
        <div className="logo">ImageEdit</div>
        <div className="menu">
          <input type="file" id="imageInput" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} />
        </div>

        <div className="save-container" style={{ marginLeft: 'auto', marginRight: '20px' }}>
          <a href="" style={{ color: 'inherit' }} onClick={saveAsJPG}><i className="fa fa-save" style={{ fontSize: '24px' }}></i></a>
        </div>
      </div>

      <div className="editor-container">


        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <a className="navbar-brand" href="#" style={{fontSize : '20px'}}>Editor</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">

                <li className="nav-item">
                  <a href='' className="nav-link" onClick={toggleNavbar}>Filter</a>
                </li>

              </ul>
            </div>
          </div>
        </nav>


        <nav className={"navbar navbar-expand-lg navbar-dark bg-dark hidden-navbar"} ref={navbarRef}>
          <div className="container-fluid">
            
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">

                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Grayscale
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><a className="dropdown-item" onClick={() => { setGrayScale('average') }}>average</a></li>
                    <li><a className="dropdown-item" onClick={() => { setGrayScale('lightness') }}>lightness</a></li>
                    <li><a className="dropdown-item" onClick={() => { setGrayScale('luminosity') }}>luminosity</a></li>
                    <li><a className="dropdown-item" onClick={() => { setGrayScale('') }}>none</a></li>
                  </ul>
                </li>

                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Contrast
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><a className="dropdown-item" onClick={() => { setContrast(0.25) }}>0.25</a></li>
                    <li><a className="dropdown-item" onClick={() => { setContrast(0.5) }}>0.5</a></li>
                    <li><a className="dropdown-item" onClick={() => { setContrast(0.75) }}>0.75</a></li>
                    <li><a className="dropdown-item" onClick={() => { setContrast(1) }}>1.0</a></li>
                  </ul>
                </li>

                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Blur
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><a className="dropdown-item" onClick={() => { setBlur(0.5) }}>0.5</a></li>
                    <li><a className="dropdown-item" onClick={() => { setBlur(1) }}>1.0</a></li>
                    <li><a className="dropdown-item" onClick={() => { setBlur(1.5) }}>1.5</a></li>
                    <li><a className="dropdown-item" onClick={() => { setBlur(2) }}>2.0</a></li>
                  </ul>
                </li>

                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Brightness
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><a className="dropdown-item" onClick={() => { setBrightness(0.05) }}>0.05</a></li>
                    <li><a className="dropdown-item" onClick={() => { setBrightness(0.1) }}>0.1</a></li>
                    <li><a className="dropdown-item" onClick={() => { setBrightness(0.15) }}>0.15</a></li>
                    <li><a className="dropdown-item" onClick={() => { setBrightness(0.2) }}>0.2</a></li>
                    <li><a className="dropdown-item" onClick={() => { setBrightness(0.25) }}>0.25</a></li>
                    <li><a className="dropdown-item" onClick={() => { setBrightness(0.3) }}>0.3</a></li>
                    <li><a className="dropdown-item" onClick={() => { setBrightness(0.35) }}>0.35</a></li>
                    <li><a className="dropdown-item" onClick={() => { setBrightness(0.4) }}>0.4</a></li>
                    <li><a className="dropdown-item" onClick={() => { setBrightness(0.45) }}>0.45</a></li>
                    <li><a className="dropdown-item" onClick={() => { setBrightness(0.5) }}>0.5</a></li>
                    <li><a className="dropdown-item" onClick={() => { setBrightness(0.55) }}>0.55</a></li>
                    <li><a className="dropdown-item" onClick={() => { setBrightness(0.6) }}>0.6</a></li>
                    <li><a className="dropdown-item" onClick={() => { setBrightness(0.65) }}>0.65</a></li>
                    <li><a className="dropdown-item" onClick={() => { setBrightness(0.7) }}>0.7</a></li>
                    <li><a className="dropdown-item" onClick={() => { setBrightness(0.75) }}>0.75</a></li>
                    <li><a className="dropdown-item" onClick={() => { setBrightness(0.8) }}>0.8</a></li>
                    <li><a className="dropdown-item" onClick={() => { setBrightness(0.85) }}>0.85</a></li>
                    <li><a className="dropdown-item" onClick={() => { setBrightness(0.9) }}>0.9</a></li>
                    <li><a className="dropdown-item" onClick={() => { setBrightness(0.95) }}>0.95</a></li>
                    <li><a className="dropdown-item" onClick={() => { setBrightness(1) }}>1.0</a></li>

                  </ul>
                </li>

                <li className="nav-item">
                  <a className="nav-link" onClick={setSepia}>Sepia</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" onClick={setInvert}>Invert</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link disabled" tabIndex="-1" aria-disabled="true">Disabled</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>


        <div className="canvas-area" style={{ backgroundColor: 'rgb(221 221 221)' }}>
          <button type="button" className="btn btn-primary btn-lg btn-block" onClick={() => { fileInputRef.current.click() }} ref={buttonRef}>Select Image</button>
          <canvas id="myCanvas" ref={canvasRef} style={{ display: 'none' }}></canvas>
        </div>

        <div className="button-container" ref={resetButtonRef} style={{ display: 'none' }}>
          <button type="button" className="btn btn-primary btn-lg btn-block sticky-button" onClick={() => { fileInputRef.current.click() }}
            ref={buttonRef2} style={{ marginRight: '20px', display: 'none' }}>Select Image</button>
          <button className="btn btn-secondary btn-lg btn-block sticky-button" onClick={reset}>Reset</button>
        </div>

      </div>



    </div>)

}

export default App;