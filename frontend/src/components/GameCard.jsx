import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Skeleton,
  Button,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { fetchAPIRequest } from '../helpers.js';
import logo from '../assets/quantsoc.jpg';
import { CopyBtn, GameTriggerBtn } from './index.js';

const GameCard = ({ gameId }) => {
  const [isLoading, setIsLoading] = useState(false);
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
    };

    fetchGame();
  }, [gameId]);

  return (
    <Card sx={{ width: 400, height: 400, borderRadius: 3, boxShadow: 3 }}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="150"
        image={logo}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {cardData.name}
        </Typography>
        {gameSession && (
          <CopyBtn
            copyTitle="Session"
            copyContent={gameSession}
            styling={{ float: 'right' }}
          />
        )}

        <Typography
          sx={{
            fontSize: 20,
            display: 'flex',
            alignItems: 'center',
          }}
          color="text.secondary"
          gutterBottom
        >
          <AccessTimeIcon sx={{ mr: 0.5 }} />
          {cardData?.rounds?.length}s
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ height: 80, overflowY: 'auto', fontSize: 16 }}
        >
          {cardData.desc}
        </Typography>
      </CardContent>
      <CardActions sx={{ alignItems: 'flex-end' }}>
        <Button>Edit</Button>
        <GameTriggerBtn
          gameId={gameId}
          gameSessionSetter={setGameSession}
          initIsStart={isStart}
          initGameSession={gameSession}
        />
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
