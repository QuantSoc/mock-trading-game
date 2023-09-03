import React, { useState, useEffect } from 'react';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Skeleton,
  Box,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import { fetchAPIRequest } from '../helpers.js';
import banner from '../assets/mtg-image.png';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { GameTriggerBtn, RedirectBtn } from './index.js';

const GameCard = ({ gameId, isLoading, setCardCount }) => {
  const [cardData, setCardData] = useState({});
  const [isStart, setIsStart] = useState(false);
  const [gameSession, setGameSession] = useState('');

  useEffect(() => {
    const fetchGame = async () => {
      const gameData = await fetchAPIRequest(`/games/${gameId}`, 'GET');
      setCardData(gameData);
      if (gameData.active !== null) {
        setIsStart(true);
        setGameSession(gameData.active);
      }
      setCardCount((count) => count + 1);
    };

    fetchGame();
  }, [gameId, setCardCount]);

  return (
    <Card
      sx={{ width: 400, minHeight: 300, borderRadius: '10px', boxShadow: 1 }}
    >
      <CardMedia
        component="img"
        alt="green iguana"
        height="125"
        image={cardData.media ? cardData.media : banner}
      />
      <CardContent>
        {isLoading ? (
          <Skeleton variant="rounded" width="100%" height={30} />
        ) : (
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              m: 0,
            }}
          >
            {cardData.name}
          </Typography>
        )}
        {isLoading ? (
          <Skeleton variant="rounded" width={50} height={30} sx={{ mt: 1 }} />
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              height: 45,
            }}
          >
            <Typography
              sx={{
                display: 'flex',
                alignItems: 'center',
                m: 0,
              }}
              color="text.secondary"
              gutterBottom
            >
              <EventIcon sx={{ mr: 0.5, color: 'text.secondary' }} />
              {new Date(cardData?.createdAt).toLocaleDateString()}
            </Typography>

            {gameSession && (
              <RedirectBtn
                btnText={<Typography variant="h6">{gameSession}</Typography>}
                isStartIcon
                icon={<ArrowForwardIcon />}
                destination={`/admin/game/${gameId}/${gameSession}`}
              />
            )}
          </Box>
        )}
        {isLoading ? (
          <Skeleton variant="rounded" width="100%" height={50} sx={{ mt: 1 }} />
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, height: 50, overflowY: 'auto', fontSize: 16 }}
          >
            {cardData.desc}
          </Typography>
        )}
      </CardContent>
      <CardActions sx={{ alignItems: 'flex-end' }}>
        {isLoading ? (
          <Skeleton
            variant="rounded"
            width={65}
            height={35}
            sx={{ mt: 1, ml: 1 }}
          />
        ) : (
          <RedirectBtn destination={`/edit/${gameId}`} btnText="Edit" />
        )}
        {isLoading ? (
          <Skeleton variant="rounded" width={135} height={35} sx={{ mt: 1 }} />
        ) : (
          <GameTriggerBtn
            gameId={gameId}
            gameSessionSetter={setGameSession}
            initIsStart={isStart}
            initGameSession={gameSession}
          />
        )}
        {/* {isLoading
            ? <Skeleton variant="rounded" width={50} />
            : <EditQuizBtn id={props.game} />
          }
          {isLoading
            ? <Skeleton variant="rounded" width={50} />
            : <GameStateBtn quizId={props.game} />
          } */}
      </CardActions>
    </Card>
  );
};
export default GameCard;
