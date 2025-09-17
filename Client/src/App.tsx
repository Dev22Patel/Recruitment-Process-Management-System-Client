import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import AppRoutes from './Routes/AppRoutes';
import { Toaster } from 'sonner';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <AppRoutes />
        </div>
      </Router>

      <Toaster />
    </AuthProvider>
  );
};

export default App;
