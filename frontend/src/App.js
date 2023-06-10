import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavBar, ProtectedRoute } from './components/index.js';
import {
  Dashboard,
  LoginPage,
  RegisterPage,
  EditGamePage,
  PlayGamePage,
  AdminSessionPage,
} from './pages/index.js';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8763cb',
      darker: '#513b7a',
    },
  },
});

const App = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        height: 'fit-content',
        backgroundColor: '#f2f2f2',
      }}
    >
      <Box sx={{ height: 71.5 }} />
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <NavBar />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/edit/:gameId" element={<EditGamePage />} />
              <Route path="/join/:sessionId" element={<PlayGamePage />} />
              <Route
                path="/admin/session/:sessionId"
                element={<AdminSessionPage />}
              />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </Box>
  );
};

export default App;
