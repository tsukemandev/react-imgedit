import React from 'react'
import './Home.css'
import { Helmet } from "react-helmet";

import { useNavigate } from 'react-router-dom';

function Home() {

    const navigate = useNavigate();

    function goToEditor() {
        navigate('/editor')
    }

    function goToBackgroundRemover() {
        navigate('/background-remover')
    }


    return (
        <div>
            <Helmet>
                {/* 메인 페이지에 대한 SEO 태그 */}
                <title>Imgdit - Online Image Editing and Background Removal</title>
                <meta name="description" content="Welcome to Imgdit, the ultimate online tool for image editing and background removal. Start editing your images today!" />
                <meta name="keywords" content="image editing, background removal, online editor, photo editor, imgdit" />
                <meta property="og:title" content="Imgdit - Online Image Editing and Background Removal" />
                <meta property="og:description" content="Imgdit is your go-to tool for all image editing needs. Easily remove backgrounds and enhance your images online." />
                <meta property="og:image" content="https://imgdit.com/images/icon.png" />
                <meta property="og:url" content="https://imgdit.com" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Imgdit - Online Image Editing and Background Removal" />
                <meta name="twitter:description" content="Edit your images with Imgdit, the powerful online editor that includes background removal tools." />
                <meta name="twitter:image" content="https://imgdit.com/images/icon.png" />
                <link rel="canonical" href="https://imgdit.com" />
            </Helmet>

            <div className="navbar">
                <div className="logo"><a href='/' style={{color : 'white', textDecoration : 'none'}}>Imgdit.com</a></div>

            </div>

            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="btn-container">
                            <button type="button" className="btn btn-primary btn-lg btn-block" onClick={goToEditor}>Editor</button>
                            <button type="button" className="btn btn-primary btn-lg btn-block" onClick={goToBackgroundRemover}>Background Remover</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Home