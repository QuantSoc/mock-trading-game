import { useEffect, useState } from 'react';

import { Modal, RedirectBtn } from './index.js';
import useModal from '../hooks/useModal.jsx';

import { Button, Box, Typography, Skeleton } from '@mui/material';
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
  const [isLoading, setIsLoading] = useState(true);
  const startGame = async () => {
    setIsLoading(true);
    const sessionData = await fetchAPIRequest(`/games/${gameId}/start`, 'POST');
    setGameSession(sessionData.sessionId);
    isStart ? gameSessionSetter('') : gameSessionSetter(sessionData.sessionId);
    setIsLoading(false);
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
          {isStart && isLoading ? (
            <Skeleton
              variant="rounded"
              width={248}
              height={72}
              sx={{ mx: 'auto' }}
            />
          ) : (
            <Typography variant="h2" textAlign="center">
              {isStart && `${gameSession}`}
            </Typography>
          )}
          <Typography variant="h6" textAlign="center" sx={{ mb: 2 }}>
            {isStart
              ? `Players can join at \r\n ${window.location.origin.toString()}/join/${gameSession}`
              : 'Would you like to view the session results?'}
          </Typography>
          {isStart ? (
            <RedirectBtn
              destination={`/admin/game/${gameId}/${gameSession}`}
              btnText="Begin Session"
              variant="contained"
              isStartIcon
              icon={<ArrowForwardIcon />}
              styling={{ my: 2 }}
              disabled={isLoading}
            />
          ) : (
            <RedirectBtn
              destination={`/history/${gameSession}`}
              btnText="View Results"
              variant="contained"
              isStartIcon
              icon={<ArrowForwardIcon />}
              styling={{ my: 2 }}
            />
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
