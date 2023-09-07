import {
  Button,
  Box,
  Divider,
  TextField,
  Typography,
  LinearProgress,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { fetchAPIRequest } from '../helpers';
import GroupIcon from '@mui/icons-material/Group';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import RequestPageOutlinedIcon from '@mui/icons-material/RequestPageOutlined';

const BidAskPanel = ({
  teamId,
  teamName,
  balance,
  contracts,
  position,
  marketIndex,
  lastBid,
  lastAsk,
}) => {
  const [isTradeSuccess, setIsTradeSuccess] = useState(false);
  const [bid, setBid] = useState('');
  const [ask, setAsk] = useState('');

  useEffect(() => {
    setIsTradeSuccess(false);
  }, [position]);

  const submitSpread = async () => {
    await fetchAPIRequest(`/game/${teamId}/submit`, 'PUT', {
      bid,
      ask,
      marketIndex,
    });

    // res.status === 200 && setIsTradeSuccess(true);
  };

  return (
    <Box
      sx={{
        borderRadius: '10px',
        p: 2,
        width: { xs: '80%', md: '70%' },
        border: '0.5px solid #E0E0E0',
        maxWidth: 500,
        m: 'auto',
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 auto',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          fontWeight={500}
          sx={{
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <GroupIcon fontSize="small" sx={{ mr: 1 }} />
          {teamName}
        </Typography>
      </Box>
      {isTradeSuccess && (
        <Typography color="text.secondary" textAlign="right">
          Awaiting next round
        </Typography>
      )}
      {isTradeSuccess && <LinearProgress sx={{ my: 1 }} />}
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
        <Typography sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PaidOutlinedIcon sx={{ mr: 1 }} />
          {balance?.toFixed(2)}
        </Typography>
        <Typography
          variant="h6"
          fontSize={16}
          sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
        >
          <RequestPageOutlinedIcon color="primary" sx={{ mr: 1 }} />
          {`${contracts} `}
          <Typography color="text.secondary" sx={{ ml: 1 }}>
            contracts
          </Typography>
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
        <TextField
          color="error"
          label="Bid Price"
          type="number"
          sx={{ mr: 1 }}
          autoFocus
          onChange={(event) => setBid(event.target.value)}
          disabled={lastBid !== 0 || lastAsk !== 0}
          value={lastBid ? lastBid : bid}
        />
        <TextField
          color="success"
          label="Ask Price"
          type="number"
          sx={{ ml: 1 }}
          onChange={(event) => setAsk(event.target.value)}
          disabled={lastBid !== 0 || lastAsk !== 0}
          value={lastAsk ? lastAsk : ask}
        />
      </Box>
      <Button
        variant="contained"
        disabled={lastBid !== 0 || lastAsk !== 0}
        onClick={submitSpread}
        sx={{ mx: 'auto', px: 5, mt: 2 }}
      >
        Submit
      </Button>
    </Box>
  );
};
export default BidAskPanel;
