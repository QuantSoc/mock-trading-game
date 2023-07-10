import { Button, Box, Typography } from '@mui/material';
import { Modal } from './index.js';
import { fetchAPIRequest } from '../helpers';
import { useEffect } from 'react';
import useModal from '../hooks/useModal';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';

const AdvanceGameBtn = ({
  gameId,
  isSessionStart,
  setIsSessionStart,
  isEnd,
}) => {
  const { isModalShown, toggleModal } = useModal();

  const advanceSession = async () => {
    const res = await fetchAPIRequest(`/games/${gameId}/next`, 'POST');
    res && setIsSessionStart(true);
  };

  const endSession = async () => {
    const res = await fetchAPIRequest(`/games/${gameId}/end`, 'POST');
    // res && setIsSessionStart(false);
  };

  return !isEnd ? (
    <Button
      variant="contained"
      size="large"
      onClick={advanceSession}
      startIcon={!isSessionStart ? <PlayArrowIcon /> : <ArrowForwardIcon />}
      sx={{ my: 2 }}
    >
      {!isSessionStart ? 'Start Game' : 'Advance'}
    </Button>
  ) : (
    <>
      <Modal
        isModalShown={isModalShown}
        toggleModal={toggleModal}
        modalTitle="Game Complete"
      >
        <Box>
          <Typography variant="h6">
            Would you like to view the session results?
          </Typography>
          <Button
            startIcon={<ArrowForwardIcon />}
            color="primary"
            variant="contained"
            sx={{ my: 2 }}
          >
            View Results
          </Button>
        </Box>
      </Modal>
      <Button
        variant="contained"
        color="error"
        size="large"
        onClick={() => {
          endSession();
          toggleModal();
        }}
        startIcon={<StopIcon />}
        sx={{ my: 2 }}
      >
        End Game
      </Button>
    </>
  );
};
export default AdvanceGameBtn;
