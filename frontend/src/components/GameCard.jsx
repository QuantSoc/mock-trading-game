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

import { fetchAPIRequest } from '../helpers.js';
import logo from '../assets/quantsoc.jpg';

const GameCard = ({ gameId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [cardData, setCardData] = useState({});

  useEffect(() => {
    const fetchGame = async () => {
      const gameData = await fetchAPIRequest(`/games/${gameId}`, 'GET');
      setCardData(gameData);
    };

    fetchGame();
  }, [gameId]);

  return (
    <Card sx={{ width: 345, height: 360, borderRadius: 2, boxShadow: 3 }}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="140"
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
        <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
          Rounds: {cardData?.rounds?.length}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ height: 60, overflowY: 'auto' }}
        >
          {cardData.desc}
        </Typography>
      </CardContent>
      <CardActions>
        <Button>Edit</Button>
        <Button color="success">Start Game</Button>
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
