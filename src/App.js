import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './COMPONENTS/Navbar';
import Home from './COMPONENTS/Home';
import About from './COMPONENTS/About';
import Notestate from './Context/NoteState';
function App() {
  return (
    <>
    <Notestate>
      <Router>
      <Navbar />
        <div>
          <Routes>
            <Route exact path="/" element={<Home/>} />
            <Route exact path="/about" element={<About/>} />
    
          </Routes>
        </div>
      </Router>
   </Notestate>
    </>
  );
}

export default App;
