import React, { useState, useEffect } from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import { fetchAPIRequest } from '../../helpers';
import GameAccordion from './GameAccordion';

const GameHistoryPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userGames, setUserGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      await fetchAPIRequest('/games', 'GET');
      const gameData = await fetchAPIRequest('/games', 'GET');
      setUserGames(gameData?.games);
      setIsLoading(false);
    };

    fetchGames();
  }, []);

  return (
    <Box
      className="responsive-pad"
      sx={{
        width: '100%',
        minHeight: '92.5vh',
        height: 'fit-content',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
        pt: 10,
        // px: { xs: 1, sm: 10, md: 18, lg: 25 },
      }}
    >
      <Box
        sx={{
          backgroundColor: '#fff',
          flexGrow: 1,
          borderRadius: '20px 20px 0px 0px',
          boxShadow: 3,
          px: { xs: 2, sm: 5 },
          py: 7,
        }}
      >
        <Typography
          variant="h4"
          sx={{ display: 'flex', alignItems: 'center', mb: 3 }}
        >
          <HistoryIcon sx={{ width: 35, height: 35, mr: 1.5 }} />
          Game History
        </Typography>
        {isLoading &&
          Array.from({ length: 9 }, (_, index) => (
            <Skeleton
              variant="rounded"
              width="100%"
              height={48}
              sx={{ mb: 2 }}
              key={index}
            />
          ))}
        {userGames?.map((game, index) => {
          return (
            <GameAccordion
              key={`game-history-accordion-${index}`}
              gameName={game.name}
              creationDate={game.createdAt}
              sessions={game.oldSessions}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default GameHistoryPage;
