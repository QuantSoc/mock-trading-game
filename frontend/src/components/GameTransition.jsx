import { Box, Typography } from '@mui/material';

const GameTransition = ({ message, isTransition }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        top: 0,
        left: 0,
        display: 'flex',
        visibility: isTransition ? 'visible' : 'hidden',
        opacity: isTransition ? 1 : 0,
        transition: 'visibility 0.5s ease-out, opacity 0.5s ease-out',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 5,
        backgroundColor: '#ffffff',
      }}
    ></Box>
  );
};
export default GameTransition;
