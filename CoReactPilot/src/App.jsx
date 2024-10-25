import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ClassicGame from './pages/classic/ClassicGame.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <h1>Pokedle</h1>
        <nav>
          <ul>
            <li>
              <Link to="/classic">Classic Game</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/classic" element={<ClassicGame />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;