import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomNavbar from './components/Navbar';
import Home from './components/Home';
import Favorites from './components/Favorites';
import About from './components/About';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <CustomNavbar />
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route path="/favorites" element={<Favorites/>} />
          <Route path="/about" element={<About/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
