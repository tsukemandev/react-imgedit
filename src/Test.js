import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

function Test() {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  let canvas;
  var imgObj;
  useEffect(() => {
    // 캔버스 초기화
    canvas = new fabric.Canvas('myCanvas', {
      backgroundColor: 'rgb(18,18,36)',
    });

    return () => {
      if (canvas) {
        canvas.dispose();
      }
    };
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        fabric.Image.fromURL(e.target.result, function (img) {
          canvas.clear(); // 이전 내용을 지우고 새 이미지로 교체
          
          img.set({
            left: 100,
            top: 100,
            selectable: false,
          });

          imgObj = img
          canvas.add(img);
          canvas.renderAll();

          // 이미지에 클릭 이벤트 등록
          imgObj.on('mousedown', () => {
            console.log('이미지 클릭됨');
          });
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="editor-container">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
        />
        <div className="canvas-area" style={{ backgroundColor: 'rgb(221 221 221)' }}>
          <canvas id="myCanvas" ref={canvasRef} style={{ display: 'block' }}></canvas>
        </div>
      </div>
    </div>
  );
}

export default Test;
