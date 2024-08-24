


function RemoveBackground() {



    // Get a reference to the storage service, which is used to create references in your storage bucket



    return (
        <div>
            <div className="navbar">
                <div className="logo">Imgdit.com</div>
                <div className="menu">
                    <input type="file" id="imageInput" accept="image/*" style={{ display: 'none' }} />
                </div>

                <div className="save-container" style={{ marginLeft: 'auto', marginRight: '20px' }}>
                    <a href="" style={{ color: 'inherit' }}><i className="fa fa-save" style={{ fontSize: '24px' }}></i></a>
                </div>
            </div>
            <div className="editor-container">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className="d-flex flex-row">
                    <div class="p-3">Flex item 1</div>
  <div class="p-3">Flex item 2</div>
  <div class="p-3">Flex item 3</div>
                    </div>
                    <div className="container-fluid">
                        <a className="navbar-brand" href="" style={{ fontSize: '20px' }}>Background Remover</a>
                    </div>
                </nav>
            </div>
            <img src="img_girl.jpg" alt="Girl in a jacket" id="myimg" />
        </div>
    )
}


export default RemoveBackground