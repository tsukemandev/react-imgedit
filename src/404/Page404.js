
import React from 'react';
import "./Page404.css"

function Page404() {

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="error-template">
                        <h1>
                            Oops!</h1>
                        <h2>
                            404 Not Found</h2>
                        <div class="error-details">
                            Sorry, an error has occured, Requested page not found!
                        </div>
                        <div className="error-actions">
                            <a href="/" className="btn btn-primary btn-lg"><span className="glyphicon glyphicon-home"></span>
                                Take Me Home
                             </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
    )
}

export default Page404