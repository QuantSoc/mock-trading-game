import { useState, useEffect } from 'react';
import { fetchAPIRequest } from '../helpers';
import { RedirectButton } from '../components/index.js';
import { Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userGames, setUserGames] = useState({});

  const fetchGames = async () => {
    await fetchAPIRequest('/games', 'GET');
    const gameData = await fetchAPIRequest('/games', 'GET');
    return gameData;
  };

  useEffect(() => {
    const fetchGames = async () => {
      setIsLoading(true);
      await fetchAPIRequest('/games', 'GET');
      const gameData = await fetchAPIRequest('/games', 'GET');
      setUserGames(gameData);
      setIsLoading(false);
    };

    fetchGames();
  }, []);

  useEffect(() => {
    console.log(userGames);
  }, [userGames]);

  return (
    <Box>
      <RedirectButton
        destination="/game/new"
        btnText="New Game"
        variant="contained"
        color="primary"
        isStartIcon={true}
        icon={<AddIcon />}
      />
    </Box>
  );
};
export default Dashboard;
