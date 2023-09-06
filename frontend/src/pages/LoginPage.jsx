import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import { ReactComponent as QuantsocIcon } from '../assets/quantsoc.svg';
import { BACKEND_ROUTE } from '../constants';
import { AlertContext } from '../contexts/NotificationContext';
const LoginPage = () => {
  const alertCtx = useContext(AlertContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(BACKEND_ROUTE + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      const token = data?.token;
      localStorage.setItem('token', token);
      navigate(from, { replace: true });
      alertCtx.success("Welcome to QuantSoc's Mock Trading Game");
    } catch (error) {
      alertCtx.error(error.message);
    }
  };

  return (
    <Box
      className="responsive-pad"
      sx={{
        height: '92.5vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <QuantsocIcon style={{ maxWidth: 100, padding: '0 20px', mb: 20 }} />
        <Typography sx={{ fontSize: 34 }}>Mock Trading Game</Typography>
      </Box>
      <Typography variant="h5" textAlign="center">
        Sign In
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 800,
          minWidth: 300,
          rowGap: 7,
          py: 2,
          px: { xs: 7, sm: 20 },
          m: 3,
          boxSizing: 'border-box',
        }}
      >
        <TextField
          id="login-email"
          label="Email"
          variant="standard"
          type="email"
          name="login-email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="example@email.com"
          fullWidth
          autoFocus
        />
        <TextField
          id="login-password"
          label="Password"
          variant="standard"
          type="password"
          name="register-password"
          placeholder="••••••••••"
          fullWidth
          onChange={(event) => setPassword(event.target.value)}
        />
        <Typography variant="body2" sx={{ fontSize: 16 }}>
          {"Don't have an account? "}
          <Typography
            variant="body2"
            color="text.secondary"
            component="a"
            sx={{
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: 16,
            }}
            onClick={() => navigate('/register')}
          >
            Sign up here
          </Typography>
        </Typography>
        <Button type="submit" variant="contained" size="large">
          Log In
        </Button>
      </Box>
    </Box>
  );
};
export default LoginPage;
