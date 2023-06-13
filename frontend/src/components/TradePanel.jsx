import { Button, Box, Divider, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

const TradePanel = ({ teamName, balance, contracts, total, isWinner }) => {
  return (
    <Box
      sx={{
        backgroundColor: 'white',
        boxShadow: 3,
        borderRadius: 3,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 auto',
        border: isWinner && '1px solid limegreen',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          // width: { xs: 2, sm: 100, md: 150, lg: 170 },
          // textOverflow: 'ellipsis',
          // overflow: 'hidden',
          // whiteSpace: 'nowrap',
          wordBreak: 'break-all',
        }}
      >
        {teamName}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5">Balance: ${balance}</Typography>
        <Typography variant="h5">{contracts} Contracts</Typography>
        <Typography variant="h5">Total: ${total}</Typography>
      </Box>
    </Box>
  );
};
export default TradePanel;
