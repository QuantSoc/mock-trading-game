import { useState, useEffect } from 'react';
import useModal from '../hooks/useModal.jsx';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Modal } from '../components/index.js';
import AddIcon from '@mui/icons-material/Add';
import { fetchAPIRequest } from '../helpers.js';

const GAMENAME_REGEX = /^[a-zA-Z0-9-_ ]{5,60}$/;

const CreateGameButton = ({ callback }) => {
  const [gameName, setGameName] = useState('');
  const [isValidName, setValidName] = useState(false);
  const [isNameFocus, setNameFocus] = useState(false);

  const [gameDesc, setGameDesc] = useState('');

  const { isModalShown, toggleModal } = useModal();

  useEffect(() => {
    const result = GAMENAME_REGEX.test(gameName);
    setValidName(result);
  }, [gameName]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newGameId = await fetchAPIRequest('/games/new', 'POST', {
      name: gameName,
      desc: gameDesc,
    });

    console.log(newGameId);
  };

  return (
    <>
      <Modal
        isModalShown={isModalShown}
        toggleModal={toggleModal}
        modalTitle="Create a new game"
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            rowGap: 2,
            px: 5,
          }}
        >
          <Typography variant="h6">Enter a name for your new quiz.</Typography>
          <TextField
            label="Game name"
            placeholder={`SQT 📆 ${new Date().toDateString()}`}
            fullWidth
            required
            variant="standard"
            sx={{ pb: 2 }}
            error={isNameFocus && !isValidName}
            helperText={
              isNameFocus &&
              !isValidName &&
              '⚠️ Please enter between 5 and 60 characters (incl. spaces).'
            }
            onChange={(event) => setGameName(event.target.value)}
            onFocus={() => setNameFocus(true)}
            onBlur={() => setNameFocus(false)}
          />
          <Typography variant="h6">Please enter a short description</Typography>
          <TextField
            label="Description"
            placeholder="SQT has joined forces with Quantsoc to bring you our FIRST event of the term and the FINAL event of the semester: MOCK TRADING @ UNSW! 🚀"
            fullWidth
            required
            multiline
            variant="standard"
            sx={{ pb: 2, height: 'fitContent' }}
            onChange={(event) => setGameDesc(event.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={!isValidName}
            onClick={() => {
              toggleModal();
              callback(true);
            }}
          >
            Create
          </Button>
        </Box>
      </Modal>
      <Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          // sx={{ width: 150, height: 65, whiteSpace: 'nowrap' }}
          onClick={toggleModal}
        >
          New Game
        </Button>
      </Box>
    </>
  );
};
export default CreateGameButton;
