//import logo from './logo.svg';
import './Editor.css';

import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

import { Link } from 'react-router-dom'

function Editor() {
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const buttonRef = useRef(null)
  const buttonRef2 = useRef(null)
  const buttonRef3 = useRef(null)

  const resetButtonRef = useRef(null)
  const cropCutButtonRef = useRef(null)

  const isNavbarVisible = useRef(false); // useState 대신 useRef로 관리
  const navbarRef = useRef(null);


  var isDrawing = false;
  var originalFile;
  var imgObj
  var canvas
  var scaleFactor

  var originalWidth
  var originalHeight


  var croppedWidth, croppedHeight, croppedImg, cropRect;

  //const imgEl = useRef(null)
  const options = {
    backgroundColor: 'rgb(18,18,36)',
    selectionColor: 'blue',
    // 추가 옵션들...
  };



  const eventFunc = function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();


    reader.onload = function (e) {

      if (canvas) {
        canvas.dispose();
      }

      // 새로운 캔버스를 생성합니다.
      canvas = new fabric.Canvas('myCanvas', options);

      fabric.Image.fromURL(e.target.result, function (img) {

        originalWidth = img.width;
        originalHeight = img.height;

        originalFile = e.target.result


        canvasRef.current.style.display = 'block';
        canvasRef.current.style.opacity = '100';
        resetButtonRef.current.style.display = 'block'
        cropCutButtonRef.current.style.display = 'none'
        buttonRef.current.style.display = 'none'
        buttonRef2.current.style.display = ''

        // 이미지 설정
        img.set({
          left: 0,
          top: 0,
          angle: 0,
          opacity: 1,
          selectable: false
        });



        // 현재 뷰포트 크기 가져오기
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // 원하는 캔버스 크기 계산 (예: 뷰포트의 80% 크기로 설정)
        let maxCanvasWidth = viewportWidth * 0.6;
        let maxCanvasHeight = viewportHeight * 0.6;

        if (viewportWidth < 900) {
          maxCanvasWidth = viewportWidth * 0.8;
          maxCanvasHeight = viewportHeight * 0.6;
        }


        // 이미지의 원본 크기와 비교하여 스케일 계산
        const scaleX = maxCanvasWidth / originalWidth;
        const scaleY = maxCanvasHeight / originalHeight;

        // 이미지가 뷰포트에 맞게끔 가장 작은 스케일 값 사용
        scaleFactor = Math.min(scaleX, scaleY);

        img.scale(scaleFactor); // 스케일링 적용

        // imgObj가 제대로 설정되었는지 확인

        imgObj = img;
        canvas.add(img);
        //canvas.add(el);

        // 캔버스의 크기를 이미지의 크기에 맞게 조정
        canvas.setWidth(originalWidth * scaleFactor);
        canvas.setHeight(originalHeight * scaleFactor);


        // 이미지 캔버스 중앙에 배치
        canvas.centerObject(img);
        canvas.renderAll();

        imgObj.on('mousedown', closeFilterMenu);

      });

      event.target.value = '';

    }
    if (file) {
      reader.readAsDataURL(file);
    }
  }


  useEffect(() => {
    applyFilterBackend();
    const element = document.getElementById('canvas-area');
    element.addEventListener('click', closeFilterMenu)
    return () => {
      if (element) {
        element.removeEventListener('click', closeFilterMenu)
      }
    };
  }, []);

  function closeFilterMenu(e) {
    isNavbarVisible.current = false
    navbarRef.current.classList.add('hidden-navbar');
    navbarRef.current.classList.remove('visible-navbar');
  }



  function cropDragAndDrop(croppingRectWidth, croppingRectHeight) {
    // 고정된 이미지 추가 (selectable: true)
    fabric.Image.fromURL(originalFile, function (img) {
      img.set({
        left: 0,
        top: 0,
        selectable: false,
        evented: false // 선택은 가능하지만 이벤트는 처리하지 않음
      });

      img.scale(scaleFactor); // 스케일링 적용
      canvas.add(img);

      // 이미지를 덮는 반투명 사각형 만들기
      let overlayRect = new fabric.Rect({
        left: 0,
        top: 0,
        //width: img.width,
        //height: img.height,
        width: canvas.getWidth(),
        height: canvas.getHeight(),
        fill: 'rgba(0, 0, 0, 0.7)',
        selectable: false, // 사각형은 선택 불가
        evented: false
      });
      canvas.add(overlayRect);


      canvas.add(imgObj)

      //canvas.add(imgObj)
      // 클리핑 마스크를 설정하여 사각형 안의 내용만 보이게 하기
      imgObj.clipPath = new fabric.Rect({
        left: cropRect.left,
        top: cropRect.top,
        width: croppingRectWidth,
        height: croppingRectHeight,

        absolutePositioned: true
      })

      // 이미지가 가장 아래에 위치하도록 이동
      //canvas.sendToBack(img);
      canvas.renderAll();
    });
  }

  const cropImage = (e) => {
    if (e) {
      e.preventDefault()
    }

    if (cropRect && imgObj) {
      const scaleX = imgObj.scaleX || 1;
      const scaleY = imgObj.scaleY || 1;

      const { left, top, width, height } = cropRect.getBoundingRect();
      const scaledLeft = left / scaleX;
      const scaledTop = top / scaleY;
      const scaledWidth = width / scaleX;
      const scaledHeight = height / scaleY;

      croppedImg = new fabric.Image(imgObj.getElement(), {
        left: 0,
        top: 0,
        width: scaledWidth,
        height: scaledHeight,
        cropX: scaledLeft,
        cropY: scaledTop,
        scaleX: scaleX,
        scaleY: scaleY,
        selectable: false,
      });

      croppedWidth = scaledWidth * scaleX
      croppedHeight = scaledHeight * scaleY

      imgObj = croppedImg

      canvas.clear();
      canvas.add(croppedImg);
      canvas.setWidth(croppedWidth);
      canvas.setHeight(croppedHeight);
      canvas.centerObject(croppedImg);
      canvas.renderAll();

      resetButtonRef.current.style.display = 'block'
      cropCutButtonRef.current.style.display = 'none'
    }
  };


  function onCrop(e) {
    e.preventDefault()

    isNavbarVisible.current = false
    navbarRef.current.classList.add('hidden-navbar');
    navbarRef.current.classList.remove('visible-navbar');


    if (!cropRect && canvas) {

      cropRect = new fabric.Rect({
        left: canvas.getWidth() / 2,
        top: canvas.getHeight() / 2,
        width: 50,
        height: 50,

        fill: 'transparent',
        //stroke: 'red',
        //strokeWidth: 2,
        selectable: true, // 객체가 선택 가능하게 설정
        hasControls: true, // 크기 조절 가능한 핸들 표시
        lockRotation: true, // 회전 잠금
        lockScalingFlip: true, // 플립 잠금
        strokeUniform: true,


        // 조절 핸들 스타일 설정
        cornerSize: 12, // 조절 핸들의 크기
        cornerColor: 'blue', // 조절 핸들의 색상
        cornerStyle: 'circle', // 조절 핸들의 모양 (rect, circle)
        borderColor: 'red', // 조절 핸들의 테두리 색상
        cornerStrokeColor: 'white', // 조절 핸들의 테두리 색상
        transparentCorners: false, // 조절 핸들 불투명하게 설정

        absolutePositioned: true
      });


      cropRect.setControlsVisibility({ mtr: false });

      canvas.add(cropRect);
      canvas.setActiveObject(cropRect);

      cropDragAndDrop(cropRect.width * cropRect.scaleX, cropRect.height * cropRect.scaleY)
      canvas.requestRenderAll(); // 변경 사항을 캔버스에 즉시 반영


      // scaling 이벤트 감지
      cropRect.on('modified', function (event) {
        console.log('Scaling completed.');
        cropDragAndDrop(cropRect.width * cropRect.scaleX, cropRect.height * cropRect.scaleY)
      });

      resetButtonRef.current.style.display = 'none'
      cropCutButtonRef.current.style.display = 'block'
    } else {
      alert('Please! enter a Image')
    }

  }




  // ##########################################

  const toggleNavbar = (e) => {
    if (e) {
      e.preventDefault()
    }

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

  function setEmboss() {

    if (imgObj) {
      const filter = new fabric.Image.filters.Convolute({
        matrix: [1, 1, 1,
          1, 0.7, -1,
          -1, -1, -1]
      });

      const findObj = imgObj.filters.find(filter => filter.type === 'Convolute')
      if (findObj) {
        imgObj.filters = imgObj.filters.filter(filter => filter.type !== 'Convolute')
        imgObj.applyFilters();
        canvas.renderAll()
        return
      }

      imgObj.filters.push(filter)
      imgObj.applyFilters()
      canvas.renderAll()
    }

  }



  function reset() {
    //imgObj.filters = []
    //imgObj.applyFilters();
    //canvas.renderAll();

    if (canvas) {
      canvas.dispose()
      canvas = new fabric.Canvas('myCanvas', options);

      fabric.Image.fromURL(originalFile, function (img) {

        croppedImg = '' //crop 관련 데이터가 저장된 것도 모조리 초기화 시킨다.
        croppedWidth = ''
        croppedHeight = ''
        cropRect = ''

        img.set({
          left: 0,
          top: 0,
          angle: 0,
          opacity: 1,
          selectable: false
        });

        img.scale(scaleFactor); // 스케일링 적용

        imgObj = img;
        canvas.add(img)
        canvas.setWidth(originalWidth * scaleFactor)
        canvas.setHeight(originalHeight * scaleFactor)
        canvas.centerObject(img)
        canvas.renderAll()
      })

      //originalWidth * scaleFactor
    }

  }

  function saveAsJPG(e) {
    e.preventDefault();

    if (croppedImg) {

      //imgObj.scale(1)
      canvas.clear()
      canvas.add(croppedImg)
      canvas.setWidth(croppedWidth)
      canvas.setHeight(croppedHeight)
      canvas.centerObject(croppedImg)
      canvas.renderAll()



      // 캔버스 내용을 JPG 형식의 데이터 URL로 변환합니다.
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1, // 이미지 품질 (0에서 1 사이, 1이 최고 품질)
      });

      // 링크 요소를 생성하여 다운로드를 트리거합니다.
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'imgdit-image.png'; // 저장할 파일 이름
      link.click(); // 다운로드 실행

    } else {

      imgObj.scale(1)
      canvas.setWidth(imgObj.width)
      canvas.setHeight(imgObj.height)
      canvas.centerObject(imgObj)
      canvas.renderAll()

      // 캔버스 내용을 JPG 형식의 데이터 URL로 변환합니다.
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1, // 이미지 품질 (0에서 1 사이, 1이 최고 품질)
      });

      // 링크 요소를 생성하여 다운로드를 트리거합니다.
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'imgdit-image.png'; // 저장할 파일 이름
      link.click(); // 다운로드 실행


      imgObj.scale(scaleFactor)
      canvas.setWidth(imgObj.width * scaleFactor)
      canvas.setHeight(imgObj.height * scaleFactor)
    }
  }



  function saveAsJPG1(e) {
    e.preventDefault();

    if (imgObj) {

      imgObj.scale(1)
      canvas.setWidth(imgObj.width)
      canvas.setHeight(imgObj.height)
      canvas.centerObject(imgObj)
      canvas.renderAll()

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
      canvas.setWidth(imgObj.width * scaleFactor)
      canvas.setHeight(imgObj.height * scaleFactor)
    }
  }


  return (
    <div>

      <div className="navbar">
        <div className="logo">Imgdit.com</div>
        <div className="menu">
          <input type="file" id="imageInput" accept="image/*" ref={fileInputRef} onChange={eventFunc} style={{ display: 'none' }} />
        </div>

        <div className="save-container" style={{ marginLeft: 'auto', marginRight: '20px' }}>
          <a href="" style={{ color: 'inherit' }} onClick={saveAsJPG}><i className="fa fa-save" style={{ fontSize: '24px' }}></i></a>
        </div>
      </div>

      <div className="editor-container">


        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <a className="navbar-brand" href="" style={{ fontSize: '20px' }}>Editor</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">

                <li className="nav-item">
                  <Link to="/background-remover" className="nav-link">Background Remover</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>


        <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{paddingTop: '0', paddingBottom: '0'}}>
          <div className="container-fluid">

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">

                <li className="nav-item">
                  <a href='' className="nav-link" onClick={toggleNavbar}>Filter</a>
                </li>

                <li className="nav-item">
                  <a href='' className="nav-link" onClick={onCrop}>Crop</a>
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
                  <a className="nav-link" onClick={setEmboss}>Emboss</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>


        <div className="canvas-area" id="canvas-area">
          <button type="button" className="btn btn-primary btn-lg btn-block" onClick={() => { fileInputRef.current.click() }} ref={buttonRef}>Select Image</button>
          <canvas id="myCanvas" ref={canvasRef} style={{ width: '1px', height: '1px', opacity: 0 }}></canvas>
        </div>

        <div className="button-container" ref={resetButtonRef} style={{ display: 'none' }}>
          <button type="button" className="btn btn-primary btn-lg btn-block sticky-button" onClick={() => { fileInputRef.current.click() }}
            ref={buttonRef2} style={{ marginRight: '20px', display: 'none' }}>Select Image</button>
          <button className="btn btn-secondary btn-lg btn-block sticky-button" onClick={reset}>Reset</button>
        </div>

        <div className="button-container" ref={cropCutButtonRef} style={{ display: 'none' }}>
          <button type="button" className="btn btn-success btn-lg btn-block sticky-button" ref={buttonRef3} onClick={cropImage}>Cut</button>
        </div>

      </div>



    </div>)

}

export default Editor;