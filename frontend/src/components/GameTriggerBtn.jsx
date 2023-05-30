import { useEffect, useState } from 'react';

import { Modal } from './index.js';
import useModal from '../hooks/useModal.jsx';
import { CopyBtn } from './index.js';

import { Button, Box, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StopIcon from '@mui/icons-material/Stop';
import { fetchAPIRequest } from '../helpers.js';

const GameTriggerBtn = ({
  gameId,
  gameSessionSetter,
  initIsStart,
  initGameSession,
}) => {
  const { isModalShown, toggleModal } = useModal();
  const [isStart, setIsStart] = useState(false);
  const [gameSession, setGameSession] = useState(initGameSession);

  const startGame = async () => {
    const sessionData = await fetchAPIRequest(`/games/${gameId}/start`, 'POST');
    console.log(sessionData);
    setGameSession(sessionData.sessionId);
    isStart ? gameSessionSetter('') : gameSessionSetter(sessionData.sessionId);
  };

  const endGame = async () => {
    await fetchAPIRequest(`/games/${gameId}/end`, 'POST');
    setGameSession('');
    setIsStart(false);
    gameSessionSetter('');
    // isStart ? callback('') : callback(sessionData.sessionId);
  };

  useEffect(() => {
    setIsStart(initIsStart);
  }, [initIsStart]);

  return (
    <>
      <Modal
        isModalShown={isModalShown}
        toggleModal={toggleModal}
        modalTitle={isStart ? 'Game Started' : 'Game Complete'}
      >
        <Box>
          <Typography variant="h6">
            {isStart
              ? 'Please copy the session ID'
              : 'Would you like to view the session results?'}
          </Typography>
          {isStart ? (
            <CopyBtn
              copyTitle="Session"
              copyContent={gameSession}
              isContained
              styling={{ my: 2 }}
            />
          ) : (
            <Button
              startIcon={<ArrowForwardIcon />}
              color="primary"
              variant="contained"
              sx={{ my: 2 }}
            >
              View Results
            </Button>
          )}
        </Box>
      </Modal>
      <Box>
        <Button
          color={isStart ? 'error' : 'success'}
          startIcon={isStart ? <StopIcon /> : <PlayArrowIcon />}
          onClick={() => {
            toggleModal();
            setIsStart(!isStart);
            isStart ? endGame() : startGame();
          }}
        >
          {isStart ? 'End' : 'Start'} Game
        </Button>
      </Box>
    </>
  );
};
export default GameTriggerBtn;
