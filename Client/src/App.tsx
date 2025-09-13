import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import CandidateDashboard from './Pages/Dashboard';
import { Toaster } from 'sonner';

function App() {
  return (
    <>
        <Router>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<CandidateDashboard />} />
                </Routes>
            </div>
        </Router>
        
        <Toaster />
    </>
  );
}

export default App;
