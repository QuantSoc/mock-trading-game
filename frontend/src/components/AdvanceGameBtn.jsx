import { Button, Box, Typography } from '@mui/material';
import { Modal, RedirectBtn } from './index.js';
import { fetchAPIRequest } from '../helpers';
import useModal from '../hooks/useModal';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { useParams } from 'react-router-dom';

const AdvanceGameBtn = ({
  gameId,
  isSessionStart,
  setIsSessionStart,
  isEnd,
  unsetTradeBtn,
}) => {
  const { isModalShown, toggleModal } = useModal();
  const { sessionId } = useParams();
  const advanceSession = async () => {
    const res = await fetchAPIRequest(`/games/${gameId}/next`, 'POST');
    res && setIsSessionStart(true);
  };

  const endSession = async () => {
    await fetchAPIRequest(`/games/${gameId}/end`, 'POST');
  };

  return !isEnd ? (
    <Button
      variant="contained"
      size="large"
      onClick={() => {
        advanceSession();
        unsetTradeBtn();
      }}
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
          <RedirectBtn
            destination={`/history/${sessionId}`}
            btnText="View Results"
            variant="contained"
            isStartIcon
            icon={<ArrowForwardIcon />}
          />
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
