import { useState, useEffect } from 'react';
import { fetchAPIRequest } from '../helpers';
import { CreateGameBtn, GameCard } from '../components/index.js';
import { Box, Grid, Typography } from '@mui/material';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userGames, setUserGames] = useState([]);
  const [isNewGame, setIsNewGame] = useState(false);
  const [cardCount, setCardCount] = useState(0);

  const fetchGames = async () => {
    setIsLoading(true);
    await fetchAPIRequest('/games', 'GET');
    const gameData = await fetchAPIRequest('/games', 'GET');
    setUserGames(gameData?.games);
    setIsNewGame(false);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    if (cardCount > 0 && cardCount >= userGames?.length) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [cardCount, userGames]);

  useEffect(() => {
    isNewGame && fetchGames();
  }, [isNewGame]);

  return (
    <Box
      sx={{
        minHeight: '92.5vh',
        height: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 3,
        boxSizing: 'border-box',
      }}
    >
      <Typography variant="h4" sx={{ my: 2 }}>
        Mock Trading Game
      </Typography>
      <CreateGameBtn callback={setIsNewGame} />

      <Grid container columns={12} spacing={3} sx={{ p: 5 }}>
        {userGames?.map((game, index) => (
          <Grid
            item={true}
            xs={12}
            sm={12}
            md={6}
            lg={4}
            xl={4}
            key={index}
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <GameCard
              key={game.id}
              gameId={game.id}
              isLoading={isLoading}
              setCardCount={setCardCount}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
export default Dashboard;
