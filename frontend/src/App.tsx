import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Chat from './components/Chat';
import Landing from './pages/Landing';
import Loja from './pages/Loja';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/loja" element={<Loja />} />
          </Routes>
        </main>
        <Footer />
        <Chat />
      </div>
    </Router>
  );
}

export default App;
