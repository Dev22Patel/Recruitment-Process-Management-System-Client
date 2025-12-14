import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import AppRoutes from './Routes/AppRoutes';
import { Toaster } from 'sonner';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-amber-50/40">
          <AppRoutes />
        </div>
        <Toaster />
      </AuthProvider>
    </Router>
  );
};

export default App;
