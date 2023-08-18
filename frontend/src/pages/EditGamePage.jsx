import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAPIRequest } from '../helpers';
import { ImageUploadBtn } from '../components/index.js';

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
import ShowChartIcon from '@mui/icons-material/ShowChart';
import DoneIcon from '@mui/icons-material/Done';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';

const EditGamePage = () => {
  const { gameId } = useParams();
  const [oldGameName, setOldGameName] = useState('Loading...');
  const [gameName, setGameName] = useState('Loading...');
  const [oldGameDesc, setOldGameDesc] = useState('Loading...');
  const [gameDesc, setGameDesc] = useState('Loading...');
  const [gameRounds, setGameRounds] = useState([]);
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
      setGameRounds(gameData.markets);
      setIsLoading(false);
    };
    fetchGame();
  }, [gameId]);

  const saveChanges = async () => {
    await fetchAPIRequest(`/games/${gameId}`, 'PUT', {
      markets: gameRounds,
      name: gameName,
      desc: gameDesc,
      media: gameMedia,
    });
  };

  const renderMarketRounds = (markets) => {
    return (
      <Box>
        {markets.map((market, marketIndex) => {
          return (
            <Box
              key={'market' + marketIndex}
              sx={{
                px: 2,
                pt: 3,
                pb: 2,
                mb: 3,
                border: '1px solid lightgray',
                borderRadius: 3,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <TextField
                  key={'marketNameTextbox' + marketIndex}
                  label="Market Name"
                  sx={{ width: '100%' }}
                  defaultValue={market.name}
                  placeholder={market.name}
                  onChange={(event) => {
                    markets[marketIndex].name = event.target.value;
                    setGameRounds([...markets]);
                    setIsSaved(false);
                  }}
                />
                <TextField
                  key={'marketTrueValue' + marketIndex}
                  label="True Value"
                  type="number"
                  sx={{ minWidth: 25, ml: 2 }}
                  value={markets[marketIndex].trueValue}
                  placeholder={`${market.trueValue}`}
                  onChange={(event) => {
                    markets[marketIndex].trueValue = event.target.value;
                    setGameRounds([...markets]);
                    setIsSaved(false);
                  }}
                />
                <Tooltip title="Delete Market">
                  <IconButton
                    color="error"
                    onClick={() => {
                      markets.splice(marketIndex, 1);
                      setGameRounds([...markets]);
                      setIsSaved(false);
                    }}
                    sx={{ p: 2, ml: 2 }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              {market.rounds.map((round, index) => {
                return (
                  <Box key={'roundBox' + index} sx={{ py: 2, pl: 4 }}>
                    <Typography key={'roundNum' + index}>
                      Round {index + 1}
                    </Typography>
                    <Box
                      key={'roundDesc' + index}
                      sx={{ display: 'flex', pt: 1 }}
                    >
                      <TextField
                        key={'roundDescTextbox' + index}
                        label="Hint"
                        fullWidth
                        value={markets[marketIndex].rounds[index].hint}
                        placeholder={markets[marketIndex].rounds[index].hint}
                        onChange={(event) => {
                          markets[marketIndex].rounds[index].hint =
                            event.target.value;
                          setGameRounds([...markets]);
                          setIsSaved(false);
                        }}
                      />
                      <IconButton
                        color="error"
                        onClick={() => {
                          markets[marketIndex].rounds.splice(index, 1);
                          setGameRounds([...markets]);
                          setIsSaved(false);
                        }}
                        sx={{ p: 2, ml: 2 }}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Box>
                  </Box>
                );
              })}
              <Button
                key={'marketAddRound' + marketIndex}
                startIcon={<AddIcon />}
                sx={{ ml: 4 }}
                onClick={() => {
                  markets[marketIndex].rounds.push({ hint: '' });
                  setGameRounds([...markets]);
                  setIsSaved(false);
                }}
              >
                New Round
              </Button>
            </Box>
          );
        })}
        <Button
          startIcon={<ShowChartIcon />}
          // sx={{}}
          onClick={() => {
            markets.push({
              name: '',
              trueValue: 0,
              rounds: [],
            });
            setGameRounds([...markets]);
            setIsSaved(false);
          }}
        >
          New Market
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
        px: { xs: 1, sm: 10, md: 18, lg: 25 },
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
            Markets
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
          {renderMarketRounds(gameRounds)}
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
