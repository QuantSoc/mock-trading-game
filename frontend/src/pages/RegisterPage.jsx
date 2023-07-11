import {
  Box,
  Button,
  TextField,
  Typography,
  SvgIcon,
  Divider,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { ReactComponent as QuantsocIcon } from '../assets/quantsoc.svg';

const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{2,23}$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,20}$/;

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  // const [errorMessage, setErrorMessage] = useState('');

  const [email, setEmail] = useState('');
  const [isValidEmail, setValidEmail] = useState(false);
  const [isEmailFocus, setEmailFocus] = useState(false);

  const [username, setUserName] = useState('');
  const [isValidName, setValidName] = useState(false);
  const [isNameFocus, setNameFocus] = useState(false);

  const [password, setPassword] = useState('');
  const [isValidPassword, setValidPassword] = useState(false);
  const [isPasswordFocus, setPasswordFocus] = useState(false);

  const [passwordMatch, setPasswordMatch] = useState('');
  const [isValidMatch, setValidMatch] = useState(false);
  const [isMatchFocus, setMatchFocus] = useState(false);

  // useEffect(() => {
  //   setErrorMessage('');
  // }, [email, password, passwordMatch]);

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    setValidEmail(result);
  }, [email]);

  useEffect(() => {
    const result = USERNAME_REGEX.test(username);
    setValidName(result);
  }, [username]);

  useEffect(() => {
    const result = PASSWORD_REGEX.test(password);
    setValidPassword(result);
    setValidMatch(password === passwordMatch);
  }, [password, passwordMatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('https://mock-trading-game-917265559b13.herokuapp.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name: username,
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
    } catch (error) {
      alert(error);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        boxSizing: 'border-box',
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
        <QuantsocIcon style={{ maxWidth: 150, padding: '0 20px' }} />
        <Typography variant="h2">Competitions</Typography>
      </Box>
      <Divider sx={{ py: 1 }} />
      <Typography variant="h3">Register</Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: 800,
          minWidth: 300,
          borderRadius: 2,
          boxShadow: 5,
          rowGap: 2,
          p: 5,
          m: 5,
          boxSizing: 'border-box',
        }}
      >
        <TextField
          id="register-email"
          type="email"
          name="register-email"
          label="Email"
          placeholder="example@email.com"
          fullWidth
          required
          autoFocus
          variant="standard"
          error={isEmailFocus && !isValidEmail}
          helperText={
            isEmailFocus && !isValidEmail && '⚠️ Please enter a valid email.'
          }
          onChange={(event) => setEmail(event.target.value)}
          onFocus={() => setEmailFocus(true)}
          onBlur={() => setEmailFocus(false)}
        />
        <TextField
          id="register-name"
          name="register-name"
          label="Username"
          placeholder="Your Username"
          fullWidth
          required
          variant="standard"
          error={isNameFocus && !isValidName}
          helperText={
            isNameFocus &&
            !isValidName &&
            '⚠️ Please enter a single name, at least 3 characters without spaces.'
          }
          onChange={(event) => setUserName(event.target.value)}
          onFocus={() => setNameFocus(true)}
          onBlur={() => setNameFocus(false)}
        />
        <TextField
          id="register-password"
          type="password"
          name="register-password"
          label="Password"
          placeholder="••••••••••"
          fullWidth
          required
          variant="standard"
          error={isPasswordFocus && !isValidPassword}
          helperText={
            isPasswordFocus &&
            !isValidPassword && (
              <span>
                Your password must be between <b>8 to 20 characters</b> contain
                at least:
                <li>An uppercase letter</li>
                <li>A lowercase letter</li>
                <li>One number</li>
                <li>A special character</li>
              </span>
            )
          }
          onChange={(event) => setPassword(event.target.value)}
          onFocus={() => setPasswordFocus(true)}
          onBlur={() => setPasswordFocus(false)}
        />
        <TextField
          type="password"
          name="register-password-confirm"
          id="register-password-confirm"
          label="Retype Password"
          placeholder="••••••••••"
          fullWidth
          required
          variant="standard"
          error={isMatchFocus && !isValidMatch}
          helperText={
            isMatchFocus && !isValidMatch && '⚠️ Your passwords must match.'
          }
          onChange={(event) => setPasswordMatch(event.target.value)}
          onFocus={() => setMatchFocus(true)}
          onBlur={() => setMatchFocus(false)}
        />

        <Typography variant="body2" sx={{ fontSize: 16 }}>
          {'Already have an account? '}
          <Typography
            variant="body2"
            color="text.secondary"
            component="a"
            sx={{
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: 16,
            }}
            onClick={() => navigate('/login')}
          >
            Login here
          </Typography>
        </Typography>

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={
            !!(
              !isValidPassword ||
              !isValidMatch ||
              !isValidEmail ||
              !isValidName
            )
          }
        >
          Sign up
        </Button>
      </Box>
    </Box>
  );
};
export default RegisterPage;
