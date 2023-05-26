import { useState, useEffect } from 'react';
import { fetchAPIRequest } from '../helpers';
import { CreateGameButton, GameCard } from '../components/index.js';
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
    <Box>
      <CreateGameButton callback={setIsNewGame} />

      <Grid
        container
        columns={{ xs: 2, sm: 8, md: 12 }}
        spacing={3}
        sx={{ p: 5 }}
      >
        {userGames.map((game, index) => (
          <Grid item={true} xs={2} sm={4} md={4} key={index}>
            <GameCard key={game.id} gameId={game.id} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
export default Dashboard;
