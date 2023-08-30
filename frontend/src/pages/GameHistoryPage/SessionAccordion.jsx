import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const SessionAccordion = ({ sessionId, timeStarted }) => {
  const navigate = useNavigate();
  const [isHover, setIsHover] = useState(false);
  return (
    <Box
      sx={{
        width: '100%',
        height: 65,
        mb: 2,
        boxShadow: 1,
        borderRadius: 1,
        border: '1px solid #fff',
        transition: 'border-color 0.5s',
        '&:hover': {
          cursor: 'pointer',
          borderColor: '#8763cbaa',
          transitionTimingFunction: 'ease-in-out',
        },
      }}
      onClick={() => navigate(`/history/${sessionId}`)}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: '16px',
        }}
      >
        <Typography
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ArrowForwardIcon
            sx={{
              opacity: isHover ? 1 : 0,
              mr: 1,
              transition: '0.5s',
              transitionTimingFunction: 'ease-in-out',
              color: 'text.secondary',
            }}
          />
          {sessionId}
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Consolas',
            color: 'text.secondary',
          }}
        >
          {new Date(timeStarted).toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default SessionAccordion;
