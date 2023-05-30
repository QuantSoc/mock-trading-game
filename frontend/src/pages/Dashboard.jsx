import { useState, useEffect } from 'react';
import { fetchAPIRequest } from '../helpers';
import { CreateGameBtn, GameCard } from '../components/index.js';
import { Box, Grid } from '@mui/material';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userGames, setUserGames] = useState([]);
  const [isNewGame, setIsNewGame] = useState(false);

  const fetchGames = async () => {
    setIsLoading(true);
    await fetchAPIRequest('/games', 'GET');
    const gameData = await fetchAPIRequest('/games', 'GET');
    setUserGames(gameData.games);
    setIsLoading(false);
    setIsNewGame(false);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    isNewGame && fetchGames();
  }, [isNewGame]);

  useEffect(() => {
    console.log(userGames);
  }, [userGames]);

  return (
    <Box
      sx={{
        height: '92.5vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 5,
        boxSizing: 'border-box',
      }}
    >
      <CreateGameBtn callback={setIsNewGame} />

      <Grid
        container
        columns={{ xs: 2, sm: 8, md: 12, lg: 16 }}
        spacing={3}
        sx={{ p: 5 }}
      >
        {userGames.map((game, index) => (
          <Grid
            item={true}
            xs={2}
            sm={4}
            md={4}
            key={index}
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <GameCard key={game.id} gameId={game.id} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
export default Dashboard;
