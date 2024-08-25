import React from 'react'
import './Home.css'

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
            <div className="navbar">
                <div className="logo">Imgdit.com</div>

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