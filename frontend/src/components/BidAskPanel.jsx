import { Button, Box, Divider, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { fetchAPIRequest } from '../helpers';

const BidAskPanel = ({ teamId, teamName, balance, contracts }) => {
  const [isTradeSuccess, setIsTradeSuccess] = useState(false);
  const [bid, setBid] = useState('');
  const [ask, setAsk] = useState('');

  const submitSpread = async () => {
    const res = await fetchAPIRequest(`/game/${teamId}/submit`, 'PUT', {
      bid,
      ask,
    });

    res.status === 200 && setIsTradeSuccess(true);
  };

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
        width: { xs: '80%', md: '70%' },
        m: 'auto',
        mb: 3,
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
      <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
        <Typography variant="h5">balance ${balance}</Typography>
        <Typography variant="h5">contracts {contracts}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-evenly', mb: 2 }}>
        <TextField
          label="Bid Price"
          type="number"
          autoFocus
          onChange={(event) => setBid(event.target.value)}
          value={bid}
        />
        <TextField
          label="Ask Price"
          type="number"
          onChange={(event) => setAsk(event.target.value)}
          value={ask}
        />
      </Box>
      <Button
        variant="outlined"
        disabled={isTradeSuccess}
        onClick={submitSpread}
      >
        Submit
      </Button>
    </Box>
  );
};
export default BidAskPanel;
