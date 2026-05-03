import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';



import Start from './components/start.jsx';
import Login from './components/login.jsx';
function AppContent() {
  const navigate = useNavigate();

  return (
    <>
      <div className="App">
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
          <div class="container-fluid">
            <a class="navbar-brand" href="#">Daterra</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
              <ul class="navbar-nav">
                <li class="nav-item">
                  <a class="nav-link active" aria-current="page" href="/">Inicio</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="./login">Login</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="https://i.pinimg.com/736x/49/62/ee/4962ee8228258c179a707f7371a08d2b.jpg">El profe es terrible bacan</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link disabled" aria-disabled="true">Test boton deshabilitado</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        </div>
        {/* Routes */}
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/login" element={<Login />} />
        </Routes>
    </>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
              <footer class="bg-light text-center text-lg-start">
          <div class="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
            © 2026 Copyright:
            <a class="text-dark" href="https://m.media-amazon.com/images/I/61XmTyKs7sL.jpg">Daterra.com</a>
          </div>
        </footer>
    </Router>
  );
}

export default App
