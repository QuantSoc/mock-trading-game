import {
  Button,
  Box,
  Divider,
  TextField,
  Typography,
  LinearProgress,
} from '@mui/material';
import { useState } from 'react';
import { fetchAPIRequest } from '../helpers';
import GroupIcon from '@mui/icons-material/Group';
import PaidTwoToneIcon from '@mui/icons-material/PaidTwoTone';
import RequestPageTwoToneIcon from '@mui/icons-material/RequestPageTwoTone';

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
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 auto',
        width: { xs: '80%', md: '70%' },
        maxWidth: 500,
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
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <GroupIcon fontSize="large" sx={{ mr: 1 }} />
        {teamName}
      </Typography>
      {isTradeSuccess && (
        <Typography color="text.secondary">Awaiting next round</Typography>
      )}
      {isTradeSuccess && <LinearProgress />}
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <PaidTwoToneIcon fontSize="large" sx={{ mr: 1 }} />
          {balance}
        </Typography>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <RequestPageTwoToneIcon
            fontSize="large"
            color="primary"
            sx={{ mr: 1 }}
          />{' '}
          {contracts} contracts
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-evenly', mb: 2 }}>
        <TextField
          color="success"
          label="Bid Price"
          type="number"
          inputProps={{
            style: { fontSize: 20, fontFamily: 'monospace' },
          }}
          sx={{ mr: 1 }}
          autoFocus
          onChange={(event) => setBid(event.target.value)}
          value={bid}
        />
        <TextField
          color="error"
          label="Ask Price"
          type="number"
          inputProps={{
            style: { fontSize: 20, fontFamily: 'monospace' },
          }}
          sx={{ ml: 1 }}
          onChange={(event) => setAsk(event.target.value)}
          value={ask}
        />
      </Box>
      <Button
        size="large"
        variant="contained"
        disabled={isTradeSuccess}
        onClick={submitSpread}
        sx={{ mx: 4 }}
      >
        Submit
      </Button>
    </Box>
  );
};
export default BidAskPanel;
