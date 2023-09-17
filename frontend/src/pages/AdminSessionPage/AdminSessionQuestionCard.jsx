import {
  Box,
  Typography,
  Button,
  Divider,
  LinearProgress,
} from '@mui/material';
import { useState, useEffect } from 'react';

const TIMER_LIMIT = 7;

const AdminSessionQuestionCard = ({
  current,
  position,
  hasTraded,
  initiateTrade,
  setHasTraded,
  selectedMarketIndex,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(7);
  const [isTradeSuccess, setIsTradeSuccess] = useState(false);
  useEffect(() => {
    setIsTradeSuccess(false);
  }, [position]);

  useEffect(() => {
    if (hasTraded) {
      setIsTradeSuccess(true);
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);

      setTimeout(() => {
        setIsTradeSuccess(false);
        clearInterval(timer);
        setTimeRemaining(TIMER_LIMIT);
      }, TIMER_LIMIT * 1000);
    }
  }, [hasTraded]);

  return (
    <Box
      sx={{
        boxShadow: 2,
        borderRadius: '10px',
        width: { xs: '70%', md: '50%' },
        height: 'fit-content',
        py: 4,
        px: 4,
        mx: 'auto',
        border: current?.type === 'result' && '1px solid gold',
      }}
    >
      <Typography variant="h6" color="text.secondary" sx={{ float: 'right' }}>
        {position.toString()}
      </Typography>

      <Typography variant="h5">
        {current?.type[0].toUpperCase() + current?.type.slice(1)}
      </Typography>

      <Typography color="text.secondary">{current?.name}</Typography>

      <Divider sx={{ my: 2 }} />

      {current?.type === 'round' && (
        <Typography color="text.secondary">
          {current?.round && Object.values(current?.round)[selectedMarketIndex]
            ? Object.values(current?.round)[selectedMarketIndex]
            : 'No hint given'}
        </Typography>
      )}

      <Typography fontSize={18}>
        {current?.type === 'result' && 'Please view the results below.'}
      </Typography>

      {current?.type === 'round' && (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            mt: 1,
          }}
        >
          {isTradeSuccess && (
            <>
              <Typography color="text.secondary" textAlign="right">
                Seconds left to trade: {timeRemaining}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={((TIMER_LIMIT - timeRemaining) / TIMER_LIMIT) * 100}
                sx={{ my: 1, width: '100%', height: TIMER_LIMIT }}
              />
            </>
          )}
          {!isTradeSuccess && (
            <Typography>Click the button to begin trading</Typography>
          )}
          <Button
            variant="contained"
            disabled={hasTraded}
            onClick={() => {
              initiateTrade();
              setHasTraded(true);
            }}
            size="large"
            sx={{ maxWidth: '30%', mt: 2 }}
          >
            Trade
          </Button>
        </Box>
      )}
    </Box>
  );
};
export default AdminSessionQuestionCard;
