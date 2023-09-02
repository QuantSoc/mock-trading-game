import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAPIRequest } from '../../helpers';
import { ImageUploadBtn } from '../../components/index.js';

import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
  IconButton,
  Tooltip,
  Skeleton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import SegmentIcon from '@mui/icons-material/Segment';
import DoneIcon from '@mui/icons-material/Done';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import EditGameMarket from './EditGameMarket';
import EditGameSection from './EditGameSection';

const EditGamePage = () => {
  const { gameId } = useParams();
  const [oldGameName, setOldGameName] = useState('Loading...');
  const [gameName, setGameName] = useState('Loading...');
  const [oldGameDesc, setOldGameDesc] = useState('Loading...');
  const [gameDesc, setGameDesc] = useState('Loading...');
  const [gameSections, setGameSections] = useState([]);
  const [gameMedia, setGameMedia] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGame = async () => {
      const gameData = await fetchAPIRequest(`/games/${gameId}`, 'GET');
      setOldGameName(gameData.name);
      setGameName(gameData.name);
      setOldGameDesc(gameData.desc);
      setGameDesc(gameData.desc);
      setGameSections(gameData.sections);
      // setGameRounds(gameData.sections);
      setIsLoading(false);
    };
    fetchGame();
  }, [gameId]);

  useEffect(() => {
    setIsSaved(false);
  }, [gameName, gameDesc, gameMedia, gameSections, setIsSaved]);

  const saveChanges = async () => {
    await fetchAPIRequest(`/games/${gameId}`, 'PUT', {
      sections: gameSections,
      name: gameName,
      desc: gameDesc,
      media: gameMedia,
    });
  };

  const renderMarketRounds = (sections) => {
    return (
      <Box>
        {/* <Button onClick={() => console.log(gameSections)}>CLICK ME</Button> */}
        {sections.map((section, index) => (
          <EditGameSection
            key={index}
            section={section}
            setIsSaved={setIsSaved}
            setGameSections={setGameSections}
            index={index}
          />
        ))}
        <Button
          startIcon={<SegmentIcon />}
          onClick={() => {
            sections.push({
              name: '',
              markets: [],
            });
            setGameSections([...sections]);
            setIsSaved(false);
          }}
        >
          New Section
        </Button>
      </Box>
    );
  };

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
        <Typography variant="h4">
          <EditIcon sx={{ mr: 2 }} />
          Edit Game
        </Typography>
        <Box
          sx={{
            pt: 3,
            px: { md: 5 },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <TextField
              label="Name"
              variant="standard"
              value={gameName}
              onChange={(event) => {
                setIsSaved(false);
                setGameName(event.target.value);
              }}
              placeholder={oldGameName}
              autoFocus
              sx={{ pb: 5, mr: 1, width: '28%' }}
            />
            <TextField
              label="Description"
              variant="standard"
              value={gameDesc}
              onChange={(event) => {
                setIsSaved(false);
                setGameDesc(event.target.value);
              }}
              placeholder={oldGameDesc}
              autoFocus
              multiline
              sx={{ pb: 5, ml: 1, width: '68%' }}
            />
          </Box>

          <Typography variant="h5" sx={{ pb: 2 }}>
            Upload Thumbnail
          </Typography>
          <ImageUploadBtn
            callback={(imgUrl) => {
              setGameMedia(imgUrl);
              setIsSaved(false);
            }}
          />
          <Divider sx={{ my: 4 }} />
          <Typography variant="h5" sx={{ pb: 2 }}>
            Game Sections
          </Typography>
          {isLoading && (
            <>
              <Skeleton width="100%" height={100} />
              <Skeleton width="100%" height={100} />
              <Skeleton width="100%" height={100} />
              <Skeleton width="100%" height={100} />
              <Skeleton width="100%" height={100} />
            </>
          )}
          {renderMarketRounds(gameSections)}
          {/* <Button></Button> */}
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button
            size="large"
            type="submit"
            color={isSaved ? 'success' : 'primary'}
            variant="contained"
            startIcon={isSaved ? <DoneIcon /> : <SaveIcon />}
            sx={{ mt: 3 }}
            onClick={() => {
              saveChanges();
              setIsSaved(true);
            }}
          >
            {isSaved ? 'Saved' : 'Save My Changes'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
export default EditGamePage;
