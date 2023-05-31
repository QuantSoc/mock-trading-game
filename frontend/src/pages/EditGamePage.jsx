import { Box, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from 'react';
import { fetchAPIRequest } from '../helpers';
import { useParams } from 'react-router-dom';
const EditGamePage = () => {
  const { gameId } = useParams();
  const [oldGameName, setOldGameName] = useState('');
  const [gameName, setGameName] = useState('');
  const [oldGameDesc, setOldGameDesc] = useState('');
  const [gameDesc, setGameDesc] = useState('');
  const [gameRounds, setGameRounds] = useState([]);

  useEffect(() => {
    const fetchGame = async () => {
      const gameData = await fetchAPIRequest(`/games/${gameId}`, 'GET');
      setOldGameName(gameData.name);
      setGameName(gameData.name);
      setOldGameDesc(gameData.desc);
      setGameDesc(gameData.desc);
      setGameRounds(gameData.rounds);
    };
    fetchGame();
  }, [gameId]);

  useEffect(() => {
    console.log(gameName, gameDesc, gameRounds);
  }, [gameName, gameDesc, gameRounds]);

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '92.5vh',
        height: 'fit-content',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
        pt: 10,
        px: { xs: 3, sm: 10, md: 18, lg: 25 },
      }}
    >
      <Box
        sx={{
          backgroundColor: '#fff',
          flexGrow: 1,
          borderRadius: '20px 20px 0px 0px',
          boxShadow: 3,
          px: 5,
          py: 7,
        }}
      >
        <Typography variant="h4">
          <EditIcon sx={{ mr: 2 }} />
          Edit Game
        </Typography>
        <Box sx={{ pt: 3, px: { md: 5 } }}>
          <TextField
            label="Name"
            variant="standard"
            value={gameName}
            onChange={(event) => setGameName(event.target.value)}
            placeholder={oldGameName}
            autoFocus
            fullWidth
            sx={{ pb: 5 }}
          />
          <TextField
            label="Description"
            variant="standard"
            value={gameDesc}
            onChange={(event) => setGameDesc(event.target.value)}
            placeholder={oldGameDesc}
            autoFocus
            fullWidth
            multiline
          />
        </Box>
      </Box>
    </Box>
  );
};
export default EditGamePage;
