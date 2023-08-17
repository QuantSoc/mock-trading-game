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
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { fetchAPIRequest } from '../helpers.js';
import logo from '../assets/quantsoc.jpg';
import { CopyBtn, GameTriggerBtn, RedirectBtn } from './index.js';

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
    <Card sx={{ width: 400, height: 400, borderRadius: 3, boxShadow: 3 }}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="150"
        image={cardData.media ? cardData.media : logo}
        sx={{ objectFit: 'cover' }}
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
          <Skeleton variant="rounded" width={50} height={20} sx={{ mt: 1 }} />
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography
              sx={{
                fontSize: 20,
                display: 'flex',
                alignItems: 'center',
                m: 0,
              }}
              color="text.secondary"
              gutterBottom
            >
              <AccessTimeIcon sx={{ mr: 0.5 }} />
              {cardData?.rounds?.length}s
            </Typography>

            {gameSession && (
              <CopyBtn
                copyTitle="Session"
                copyContent={`localhost:3000/admin/game/${gameId}/${gameSession}`}
              />
            )}
          </Box>
        )}
        {isLoading ? (
          <Skeleton variant="rounded" width="100%" height={80} sx={{ mt: 1 }} />
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, height: 80, overflowY: 'auto', fontSize: 16 }}
          >
            {cardData.desc}
          </Typography>
        )}
      </CardContent>
      <CardActions sx={{ alignItems: 'flex-end' }}>
        {isLoading ? (
          <Skeleton variant="rounded" width={65} height={35} sx={{ mt: 1 }} />
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
