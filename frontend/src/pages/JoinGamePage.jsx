import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from "@mui/material";
import { ReactComponent as QuantsocIcon } from '../assets/quantsoc.svg';
import Logo from '../assets/crop_logo.svg';
import { BACKEND_ROUTE } from '../constants';
import { AlertContext } from '../contexts/NotificationContext';

const JoinGamePage = () => {
  const alertCtx = useContext(AlertContext);
  const navigate = useNavigate();

  const [sessionId, setSessionId] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(BACKEND_ROUTE + `/session/${sessionId}/status`);
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.active) {
        throw new Error('Session is not active');
      }
      navigate(`/join/${sessionId}`);
      alertCtx.success('Valid Session Code!');
    } catch (error) {
      alertCtx.error(error.message);
    }
  };

  return (
    <Box
			// className="responsive-pad"
      sx={{
				backgroundImage: `url(${Logo})`,
				backgroundSize: 'cover',
        height: '92.5vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
			<>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						flexWrap: 'wrap',
						marginBottom: '10px'
					}}
				>
					<QuantsocIcon style={{ maxWidth: 100, padding: '0 20px', mb: 20 }} />
					<Typography sx={{ fontSize: 34 }}>Mock Trading Game</Typography>
				</Box>
				<Typography variant="body2" textAlign="center">
					Enter the session code provided by your game host below
				</Typography>
				<Box
					component="form"
					onSubmit={() => console.log("Join Game")}
					sx={{
						width: '100%',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						maxWidth: 450,
						minWidth: 300,
						maxHeight: 160,
						rowGap: 3,
						py: 2,
						px: { xs: 7, sm: 20 },
						m: 3,
						backgroundColor: '#ffffff',
						borderRadius: '10px 10px 10px 10px',
						boxShadow: 2,
					}}
				>
					<TextField
						id="session-code"
						label="Session Code"
						variant="outlined"
						type="text"
						name="session-code"
						placeholder="e.g. 123456"
						style={{ width: '250px'}}
						onChange={(event) => setSessionId(event.target.value)}
					/>
					<Button 
						type="submit" 
						variant="contained" 
						size="large" 
						style={{
							width: '250px',
							// textTransform: 'none' // prevents all caps
						}}
						onClick={handleSubmit}>
						Join Session
					</Button>
				</Box>
			</>
			<Typography variant="body2" sx={{ fontSize: 16 }}>
          {"Want to make your own game? "}
          <Typography
            variant="body2"
            color="text.secondary"
            component="a"
            sx={{
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: 16,
            }}
            onClick={() => {
							if (localStorage.getItem('token')) {
								navigate('/')
							} else {
								navigate('/login')
							}
						}}
          >
            Click here
          </Typography>
        </Typography>
      </Typography>
    </Box>
  );
};

export default JoinGamePage;
