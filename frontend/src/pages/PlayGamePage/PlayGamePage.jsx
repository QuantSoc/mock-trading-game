import { useParams } from 'react-router-dom';
import { fetchAPIRequest } from '../../helpers';
import { useEffect, useState, useContext } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  TextField,
  Typography,
  Grid,
  LinearProgress,
  Card,
  FormControl,
} from '@mui/material';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import TeamStats from '../GameHistoryPage/TeamStats';
import { AlertContext } from '../../contexts/NotificationContext';
import PlayGameTradeArea from './PlayGameTradeArea';
import { GameTransition } from '../../components';

const PlayGamePage = () => {
  const { sessionId } = useParams();
  const [teamName, setTeamName] = useState('');
  const [myTeamId, setMyTeamId] = useState('');

  const [position, setPosition] = useState(-1);
  const [question, setQuestion] = useState({});
  const [teams, setTeams] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isTeamCreated, setIsTeamCreated] = useState(
    localStorage.getItem('localTeamId') ? true : false
  );
  const alertCtx = useContext(AlertContext);
  const [quotable, setQuotable] = useState('');
  const [isTransition, setIsTransition] = useState(false);

  // useEffect(() => {
  //   setIsTransition(true);
  //   setTimeout(() => {
  //     setIsTransition(false);
  //   }, 750);
  // }, [position]);

  const createTeam = async () => {
    const teamData = await fetchAPIRequest(`/game/join/${sessionId}`, 'POST', {
      name: teamName,
    });
    setMyTeamId(teamData.teamId);
    localStorage.setItem('localTeamId', teamData.teamId);
    setIsTeamCreated(true);
  };

  useEffect(() => {
    fetch('https://api.quotable.io/quotes/random?tags=business|mathematics')
      .then((res) => res.json())
      .then((data) => {
        setQuotable(data[0]);
      });
  }, [position]);

  const processResults = (teams, marketIndex) => {
    const teamResults = Object.keys(teams)
      .map((teamId, index) => {
        const trueValue = Object.values(question.round)[marketIndex];
        const balance =
          teams[teamId].teamAnswers[position].markets[marketIndex].balance;
        const contracts =
          teams[teamId].teamAnswers[position].markets[marketIndex].contracts;
        const total =
          parseInt(contracts, 10) * parseFloat(trueValue, 10) +
          parseFloat(balance, 10);
        return {
          teamId,
          teamName: teams[teamId].name,
          balance,
          contracts,
          total,
          trueValue,
        };
      })
      .sort((a, b) => (a.total < b.total ? 1 : -1));

    const winningTotal = teamResults[0]?.total;
    return teamResults.map((result) => {
      return { ...result, isWinner: result.total === winningTotal };
    });
  };

  useEffect(() => {
    if (localStorage.getItem('localTeamId')) {
      setMyTeamId(localStorage.getItem('localTeamId'));
    }
  }, []);

  useEffect(() => {
    const getGameStatus = async () => {
      const status = await fetchAPIRequest(
        `/session/${sessionId}/status`,
        'GET'
      );
      console.log(status.position, position);
      if (status.position !== position) {
        setIsTransition(true);
        await new Promise((r) => setTimeout(r, 500));
        setPosition(status.position);
        setTimeout(() => {
          setIsTransition(false);
        }, 500);
      }
      setQuestion(status.questions);
      setTeams(status.teams);
      if (!status.active) {
        localStorage.removeItem('localTeamId');
        alertCtx.info('This session has finished!');
      }
      setIsLoading(false);
    };
    const gameInterval = setInterval(() => {
      getGameStatus();
    }, 1000);
    return () => clearInterval(gameInterval);
  }, [sessionId, alertCtx, position]);

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '92.5vh',
        flex: '1 1 auto',
        height: 'fit-content',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
        pt: 10,
      }}
    >
      <GameTransition isTransition={isTransition} />
      <Box
        sx={{
          backgroundColor: '#fff',
          flexGrow: 1,
          borderRadius: '10px 10px 0px 0px',
          boxShadow: 2,
          width: '100%',
          px: { xs: 2, sm: 3, lg: 5 },
          py: 7,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            mb: 5,
          }}
        >
          <PriceChangeIcon sx={{ width: 50, height: 50, mr: 1 }} />
          Mock Trading
        </Typography>
        {isLoading && (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h5">Loading...</Typography>
            <LinearProgress sx={{ px: 5, mt: 2 }} />
          </Box>
        )}
        <Box>
          {!isLoading &&
            (position < 0 ? (
              <Card
                sx={{
                  mx: 'auto',
                  p: 3,
                  width: '50%',
                  borderRadius: '10px',
                  boxShadow: 2,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ display: 'flex', alignItems: 'center', my: 2 }}
                >
                  <CircularProgress sx={{ mr: 2 }} />
                  Waiting for session to start
                </Typography>
                <Typography autoFocus variant="h5" sx={{ mt: 3, mb: 1 }}>
                  Set a team name
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <TextField
                    label="Team Name"
                    required
                    inputProps={{ maxLength: 15 }}
                    fullWidth
                    sx={{ maxWidth: '70%', mr: 2 }}
                    onChange={(event) => setTeamName(event.target.value)}
                    error={isTeamCreated}
                    disabled={isTeamCreated}
                    helperText={
                      isTeamCreated
                        ? 'You have already created a team'
                        : 'Max length: 15 characters'
                    }
                  />
                  <Button
                    variant="contained"
                    disabled={isTeamCreated}
                    onClick={createTeam}
                  >
                    Create Team
                  </Button>
                </Box>
              </Card>
            ) : !myTeamId ? (
              <Typography variant="h4" color="text.secondary">
                Session already started...
              </Typography>
            ) : (
              <Box sx={{ m: 0, p: 0 }}>
                <Box
                  sx={{
                    boxShadow: 2,
                    borderRadius: '10px',
                    width: { xs: '80%', md: '50%' },
                    height: 'fit-content',
                    py: 4,
                    px: 4,
                    mx: 'auto',
                    mb: 5,
                    border: question?.type === 'result' && '1px solid gold',
                  }}
                >
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ float: 'right' }}
                  >
                    {position.toString()}
                  </Typography>
                  <Typography variant="h5">
                    {question?.type[0].toUpperCase() + question?.type.slice(1)}
                  </Typography>
                  <Typography color="text.secondary">
                    {question?.name}
                  </Typography>
                  {question?.type === 'round' && (
                    <Typography sx={{ mt: 1 }} color="text.secondary">
                      Hint:{' '}
                      {question?.round && Object.values(question?.round)[0]
                        ? Object.values(question?.round)[0]
                        : 'N/A'}
                    </Typography>
                  )}
                  <Divider sx={{ my: 3 }} />
                  {/* <Typography variant="h6">
                    {question.type === 'result' &&
                      `The fair value of this market is $${
                        Object.values(question.round)[selectedMarketIndex]
                      }.`}
                  </Typography> */}
                  <Typography fontSize={18}>
                    {question.type === 'round' &&
                      'Trading is in session. Please wait for the trades to complete.'}
                    {question.type === 'round' && (
                      <LinearProgress sx={{ mt: 1 }} />
                    )}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ mt: 2, fontStyle: 'italic', textWrap: 'balance' }}
                  >
                    {quotable.content} <br /> - {quotable.author}
                  </Typography>
                </Box>
                {/* {question.type !== 'section' && (
                  <PlayGameMarketSelector
                    current={question}
                    setSelectedMarketIndex={setSelectedMarketIndex}
                  />
                )}
                {question.type === 'round' && (
                  <PlayGameTradeArea
                    current={question}
                    position={position}
                    teams={teams}
                    myTeamId={myTeamId}
                    selectedMarketIndex={selectedMarketIndex}
                  />
                )} */}

                <Grid
                  container
                  columns={24}
                  // columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  sx={{ mt: 4 }}
                >
                  {question?.type === 'round' &&
                    Object.keys(question.round).map((market, index) => {
                      return (
                        <Grid
                          item
                          xs={24}
                          md={24}
                          lg={12}
                          xl={12}
                          key={index}
                          sx={{
                            // border: '0.5px solid #41414111',
                            borderRadius: '10px',
                            mb: 7,
                          }}
                        >
                          <Typography
                            sx={{ mb: 1, fontSize: 18, textAlign: 'center' }}
                          >
                            {market}
                          </Typography>
                          <PlayGameTradeArea
                            current={question}
                            position={position}
                            teams={teams}
                            myTeamId={myTeamId}
                            selectedMarketIndex={index}
                          />
                        </Grid>
                      );
                    })}
                </Grid>
                <Grid
                  container
                  columns={24}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  sx={{ mt: 4 }}
                >
                  {question?.type === 'result' &&
                    Object.keys(question.round).map((market, marketIndex) => {
                      return (
                        <Grid
                          item
                          xs={24}
                          md={24}
                          lg={12}
                          xl={12}
                          key={marketIndex}
                          sx={{
                            // border: '0.5px solid #41414111',
                            borderRadius: '10px',
                            mb: 7,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              // justifyContent: 'space-between',
                              alignItems: 'flex-end',
                              mb: 1,
                            }}
                          >
                            <Typography fontSize={18}>{market}</Typography>
                            <Typography
                              color="text.secondary"
                              sx={{ fontSize: 14, ml: 2 }}
                            >
                              True Value $
                              {Object.values(question.round)[marketIndex]}
                            </Typography>
                          </Box>
                          <Grid container columns={12} spacing={1}>
                            {processResults(teams, marketIndex).map(
                              (team, index) => {
                                return (
                                  <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    lg={6}
                                    key={index}
                                    sx={{
                                      display: 'flex',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <FormControl sx={{ width: '100%' }}>
                                      <TeamStats
                                        key={`team-stats-${index}`}
                                        teamName={team.teamName}
                                        balance={team.balance}
                                        contracts={team.contracts}
                                        isWinner={team.isWinner}
                                        trueValue={team.trueValue}
                                      />
                                    </FormControl>
                                  </Grid>
                                );
                              }
                            )}
                          </Grid>
                        </Grid>
                      );
                    })}
                </Grid>
              </Box>
            ))}
        </Box>
      </Box>
    </Box>
  );
};
export default PlayGamePage;
