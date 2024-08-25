
import './App.css';

import React from 'react';
import Editor from './editor/Editor';
import RemoveBackground from './removebackground/RemoveBackground';
import Page404 from './404/Page404';
import Home from './home/Home';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/editor" element={<Editor />} />
        <Route path="/background-remover" element={<RemoveBackground />} />
        <Route path="*" element={<Page404 />} />
      </Routes>


    </Router>
  )

}

export default App;