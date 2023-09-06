import './App.css';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import FormPage from './components/FormPage';
import HomePage from './components/HomePage';
import NavBar from './components/NavBar';
import { Routes, Route } from "react-router-dom";

function App() {
  return (
      <div className="App">
          <NavBar />
          <Routes>
              <Route path="/" element={<FormPage />}></Route>
              <Route path='/home' element={<HomePage/>}></Route>
              <Route path='/about' element={<AboutPage/>}></Route>
              <Route path='/contact' element={<ContactPage/>}></Route>
          </Routes>
      </div>
  );
}

export default App;
