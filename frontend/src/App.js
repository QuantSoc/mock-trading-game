import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/index.js';
import { Dashboard, LoginPage, RegisterPage } from './pages/index.js';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
