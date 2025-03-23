import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavBar, ProtectedRoute } from './components/index.js';
import {
  Dashboard,
  LoginPage,
  RegisterPage,
  EditGamePage,
  JoinGamePage,
  PlayGamePage,
  AdminSessionPage,
} from './pages/index.js';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import GameHistoryPage from './pages/GameHistoryPage/GameHistoryPage.jsx';
import SessionHistoryPage from './pages/GameHistoryPage/SessionHistoryPage.jsx';
import AlertProvider from './contexts/NotificationContext.jsx';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Poppins',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  palette: {
    primary: {
      main: '#8763cbdd',
      darker: '#513b7a',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 650,
      md: 900,
      lg: 1300,
      xl: 1536,
    },
  },
});

const App = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        height: 'fit-content',
        flex: '1 1 auto',
      }}
    >
      <Box sx={{ height: '7.5vh' }} />
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <NavBar />
          <AlertProvider>
            <Routes>
            <Route path="/" element={<JoinGamePage />} />

              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/join" element={<JoinGamePage />} />
              <Route path="/join/:sessionId" element={<PlayGamePage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/edit/:gameId" element={<EditGamePage />} />
                <Route
                  path="/admin/game/:gameId/:sessionId"
                  element={<AdminSessionPage />}
                />
                <Route
                  path="/admin/game/:gameId/:sessionId"
                  element={<AdminSessionPage />}
                />
                <Route path="/history" element={<GameHistoryPage />} />
                <Route
                  path="/history/:sessionId"
                  element={<SessionHistoryPage />}
                />
              </Route>
            </Routes>
          </AlertProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Box>
  );
};

export default App;
