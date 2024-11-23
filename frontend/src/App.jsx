
import { BrowserRouter, Routes, Route } from 'react-router';
import { Signup } from './pages/Signup';
import { Signin } from './pages/Signin';
import { Dashboard } from './pages/Dashboard';
import { SendMoney } from './pages/SendMoney';
import { AuthGuard } from './components/auth/AuthGuard';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<AuthGuard><Signup /></AuthGuard>} />
        <Route path="/signin" element={<AuthGuard><Signin /></AuthGuard>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/send" element={<SendMoney />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
