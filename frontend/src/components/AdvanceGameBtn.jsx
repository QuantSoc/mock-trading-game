import { Button } from '@mui/material';
import { fetchAPIRequest } from '../helpers';
import { useEffect } from 'react';

const AdvanceGameBtn = ({
  gameId,
  isSessionStart,
  setIsSessionStart,
  isEnd,
}) => {
  const advanceSession = async () => {
    const res = await fetchAPIRequest(`/games/${gameId}/next`, 'POST');
    res && setIsSessionStart(true);
  };

  const endSession = async () => {
    const res = await fetchAPIRequest(`/games/${gameId}/end`, 'POST');
    res && setIsSessionStart(false);
  };

  return (
    <Button
      variant="contained"
      size="large"
      color={isEnd ? 'error' : 'primary'}
      onClick={isEnd ? endSession : advanceSession}
      sx={{ my: 2 }}
    >
      {!isSessionStart ? 'Start Game' : isEnd ? 'End Game' : 'Advance'}
    </Button>
  );
};
export default AdvanceGameBtn;
