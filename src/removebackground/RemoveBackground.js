import './RemoveBackground.css'
import { fabric } from 'fabric';
import React, { useRef } from 'react';

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
                const maxCanvasWidth = viewportWidth * 0.8;
                const maxCanvasHeight = viewportHeight * 0.8;

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

        console.log('imageFile : ' + imageFile)
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
                    const maxCanvasWidth = viewportWidth * 0.8;
                    const maxCanvasHeight = viewportHeight * 0.8;

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
            <div className="navbar">
                <div className="logo">Imgdit.com</div>
                <div className="menu">
                    <input type="file" id="imageInput" accept="image/*" style={{ display: 'none' }} onChange={eventFunc} ref={fileInputRef} />
                </div>

                <div className="save-container" style={{ marginLeft: 'auto', marginRight: '20px' }}>
                    <a href="" style={{ color: 'inherit' }} onClick={saveAsJPG}><i className="fa fa-save" style={{ fontSize: '24px' }}></i></a>
                </div>
            </div>
            <div className="editor-container">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className="d-flex flex-row">
                        <div className="p-3 text-secondary">Editor</div>
                        <div className="p-3">Background Remover</div>
                        <div className="p-3 text-secondary">Transfer Format</div>
                    </div>
                </nav>


                <div className="canvas-area" style={{ backgroundColor: 'rgb(221 221 221)', paddingTop: '20px' }} id="canvas-area">
                    <canvas id="myCanvas" style={{ width: '1px', height: '1px', opacity: 0 }} ref={canvasRef}></canvas>


                    <div className="overlay" ref={overlayRef} style={{ display: 'none' }}>
                        <div className='spinner-wrap'>
                            <div className="spinner-border text-light" style={{ width: '3rem', height: '3rem' }} role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            <div className="text-light mt-2" style={{ fontSize : '1.5rem'}}>wait...</div>
                        </div>
                    </div>

                    <div className='button-wrap' ref={buttonsRef}>
                        <button type="button" className="btn btn-primary btn-lg btn-block" onClick={() => { fileInputRef.current.click() }}>Select Image</button>
                        <button type="button" className="btn btn-info btn-lg btn-block"
                            onClick={() => {
                                if (!imgObj) {
                                    alert('Please! enter your image')
                                }
                                removeBackground()
                            }}>Transfer</button>
                    </div>

                </div>
            </div>
        </div>
    )
}


export default RemoveBackground