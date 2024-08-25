import './RemoveBackground.css'
import { fabric } from 'fabric';
import React, { useRef } from 'react';


import { Link } from 'react-router-dom'

function RemoveBackground() {

    var canvas
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null)
    const processBarRef = useRef(null)
    const spinnerRef = useRef(null)
    const buttonsRef = useRef(null)
    const overlayRef = useRef(null)


    var originalWidth
    var originalHeight
    var originalFile;
    var imgObj

    var scaleX
    var scaleY
    var scaleFactor


    var processIndex = 0;
    function makeProgress() {
        if (processIndex < 100) {
            processIndex++;
            document.querySelector('.progress-bar').style.width = processIndex + '%';
            document.querySelector('.progress-bar').textContent = processIndex + ' %';
        } else {
            processBarRef.current.style.display = 'none'
            spinnerRef.current.style.display = 'block'
        }
        // Wait for sometime before running this script again
        setTimeout(makeProgress, 100);
    }

    function eventFunc(event) {
        processIndex = 0
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            if (canvas) {
                canvas.dispose();
            }

            // 새로운 캔버스를 생성합니다.
            canvas = new fabric.Canvas('myCanvas', {
                backgroundColor: 'rgb(18,18,36)',
                selectionColor: 'blue',
                // 추가 옵션들...
            });


            fabric.Image.fromURL(e.target.result, function (img) {

                canvasRef.current.style.display = 'block';
                canvasRef.current.style.opacity = '100';

                // 이미지 설정
                img.set({
                    left: 0,
                    top: 0,
                    angle: 0,
                    opacity: 1,
                    selectable: false
                });


                originalWidth = img.width;
                originalHeight = img.height;

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
                scaleX = maxCanvasWidth / originalWidth;
                scaleY = maxCanvasHeight / originalHeight;

                // 이미지가 뷰포트에 맞게끔 가장 작은 스케일 값 사용
                scaleFactor = Math.min(scaleX, scaleY);

                img.scale(scaleFactor); // 스케일링 적용

                imgObj = img;
                // imgObj가 제대로 설정되었는지 확인

                canvas.add(img);

                // 캔버스의 크기를 이미지의 크기에 맞게 조정
                canvas.setWidth(originalWidth * scaleFactor);
                canvas.setHeight(originalHeight * scaleFactor);

                // 이미지 캔버스 중앙에 배치
                canvas.centerObject(img);
                canvas.renderAll();
            });

        }

        if (file) {
            reader.readAsDataURL(file);
        }
    }

    function removeBackground() {

        // 이미지 파일을 form-data로 포함하여 POST 요청
        const formData = new FormData();
        const imageFile = fileInputRef.current.files[0];

        formData.append('image', imageFile);

        overlayRef.current.style.display = 'inherit'

        fetch('https://convert-image-i5d6tmkwia-uc.a.run.app', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (response.ok && response.headers.get('Content-Type') === 'image/png') {
                    return response.blob(); // 이미지 데이터를 blob 형식으로 변환
                } else {
                    throw new Error('Failed to load image or content type is not image/png');
                }
            })
            .then(imageBlob => {
                if (canvas) {
                    canvas.dispose();
                }

                // 새로운 캔버스를 생성합니다.
                canvas = new fabric.Canvas('myCanvas', {
                    backgroundColor: 'rgb(18,18,36)',
                    selectionColor: 'blue',
                    // 추가 옵션들...
                });

                const imageUrl = URL.createObjectURL(imageBlob);

                fabric.Image.fromURL(imageUrl, function (img) {

                    //canvasRef.current.style.display = 'block';
                    //canvasRef.current.style.opacity = '100';

                    // 이미지 설정
                    img.set({
                        left: 0,
                        top: 0,
                        angle: 0,
                        opacity: 1,
                        selectable: false
                    });


                    originalWidth = img.width;
                    originalHeight = img.height;

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
                    scaleX = maxCanvasWidth / originalWidth;
                    scaleY = maxCanvasHeight / originalHeight;

                    // 이미지가 뷰포트에 맞게끔 가장 작은 스케일 값 사용
                    scaleFactor = Math.min(scaleX, scaleY);

                    img.scale(scaleFactor); // 스케일링 적용

                    imgObj = img;
                    // imgObj가 제대로 설정되었는지 확인

                    canvas.add(img);

                    // 캔버스의 크기를 이미지의 크기에 맞게 조정
                    canvas.setWidth(originalWidth * scaleFactor);
                    canvas.setHeight(originalHeight * scaleFactor);

                    // 이미지 캔버스 중앙에 배치
                    canvas.centerObject(img);
                    canvas.renderAll();
                });

            })
            .catch(error => {
                console.error('Error:', error);
            }).finally(() => {
                overlayRef.current.style.display = 'none'
            });


        //processBarRef.current.style.display = 'block'
        //buttonsRef.current.style.display = 'none'
        //makeProgress()
    }




    // Get a reference to the storage service, which is used to create references in your storage bucket

    function saveAsJPG(e) {
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

            {/* 페이지 제목 */}
            <title>AI-Powered Background Remover - Imgdit</title>

            {/* 페이지 설명 */}
            <meta name="description" content="Remove backgrounds from your images instantly with Imgdit's AI-powered background remover. Perfect for product photos, profile pictures, and more." />

            {/* 키워드 */}
            <meta name="keywords" content="background remover, AI background removal, remove background, image editing, online editor, imgdit" />

            {/* Open Graph 메타 태그 (소셜 미디어에서 공유될 때) */}
            <meta property="og:title" content="AI-Powered Background Remover - Imgdit" />
            <meta property="og:description" content="Use Imgdit's advanced AI to remove backgrounds from images with just one click. Ideal for professionals and creatives alike." />
            <meta property="og:image" content="https://imgdit.com/images/icon.png" /> {/* 실제 이미지 URL로 교체 */}
            <meta property="og:url" content="https://imgdit.com/background-remover" />
            <meta property="og:type" content="website" />

            {/* 트위터 카드 메타 태그 */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="AI-Powered Background Remover - Imgdit" />
            <meta name="twitter:description" content="Instantly remove backgrounds from your images using Imgdit's AI-powered tools. Perfect for professional-grade results." />
            <meta name="twitter:image" content="https://imgdit.com/images/icon.png" /> {/* 실제 이미지 URL로 교체 */}

            {/* Canonical URL */}
            <link rel="canonical" href="https://imgdit.com/background-remover" />


            <div className="navbar">
                <div className="logo"><a href='/' style={{color : 'white', textDecoration : 'none'}}>Imgdit.com</a></div>
                <div className="menu">
                    <input type="file" id="imageInput" accept="image/*" style={{ display: 'none' }} onChange={eventFunc} ref={fileInputRef} />
                </div>

                <div className="save-container" style={{ marginLeft: 'auto', marginRight: '20px' }}>
                    <a href="" style={{ color: 'inherit' }} onClick={saveAsJPG}>
                        <i className="fa fa-save" style={{ fontSize: '24px' }}></i>
                        <span style={{paddingLeft : '10px', display: 'inline-block', fontSize : '20px', lineHeight: '30px'}}>save</span>
                    </a>
                    
                </div>
                
            </div>
            <div className="editor-container">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="" style={{ fontSize: '20px' }}>Background Remover</a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav">

                                <li className="nav-item">
                                    <Link to="/editor" className='nav-link'>Editor</Link>
                                </li>

                            </ul>
                        </div>
                    </div>
                </nav>


                <div className="canvas-area" style={{ paddingTop: '20px' }} id="canvas-area">
                    <canvas id="myCanvas" style={{ width: '1px', height: '1px', opacity: 0 }} ref={canvasRef}></canvas>

                    <div className='button-wrap' ref={buttonsRef}>
                        <button type="button" className="btn btn-primary btn-lg btn-block" onClick={() => { fileInputRef.current.click() }}>Select Image</button>
                        <button type="button" className="btn btn-info btn-lg btn-block"
                            onClick={() => {
                                if (!imgObj) {
                                    alert('Please! enter your image')
                                    return
                                }
                                removeBackground()
                            }}>Transfer</button>
                    </div>


                    <div className="overlay" ref={overlayRef} style={{ display: 'none' }}>
                        <div className='spinner-wrap'>
                            <div className="spinner-border text-light" style={{ width: '3rem', height: '3rem' }} role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            <div className="text-light mt-2" style={{ fontSize: '1.5rem' }}>wait...</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}


export default RemoveBackground