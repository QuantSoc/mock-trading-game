import { useParams } from 'react-router-dom';
import { fetchAPIRequest } from '../helpers';
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
import { BidAskPanel } from '../components/index.js';
import TeamStats from './GameHistoryPage/TeamStats';
import { AlertContext } from '../contexts/NotificationContext';

const PlayGamePage = () => {
  const { sessionId } = useParams();
  const [teamName, setTeamName] = useState('');
  const [myTeamId, setMyTeamId] = useState('');

  const [position, setPosition] = useState(-1);
  const [question, setQuestion] = useState({});
  const [teams, setTeams] = useState({});
  const [marketPosition, setMarketPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isTeamCreated, setIsTeamCreated] = useState(
    localStorage.getItem('localTeamId') ? true : false
  );
  const alertCtx = useContext(AlertContext);
  const [quotable, setQuotable] = useState('');

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

  const processResults = (teams) => {
    const teamResults = Object.keys(teams)
      .map((teamId, index) => {
        const trueValue = question.trueValue;
        const balance = teams[teamId].teamAnswers[marketPosition].balance;
        const contracts = teams[teamId].teamAnswers[marketPosition].contracts;
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
      setPosition(status.position);
      setQuestion(status.questions);
      setTeams(status.teams);
      if (status.position >= 0 && status.questions.type === 'market') {
        setMarketPosition(status.position);
      }
      if (!status.active) {
        localStorage.removeItem('localTeamId');
        alertCtx.info('This session has finished!');
      }
      setIsLoading(false);
    };
    setInterval(() => {
      getGameStatus();
    }, 1000);
  }, [sessionId]);

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
      <Box
        sx={{
          backgroundColor: '#fff',
          flexGrow: 1,
          borderRadius: '10px 10px 0px 0px',
          boxShadow: 2,
          width: '100%',
          px: { xs: 2, sm: 5 },
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
              <>
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
                  <Typography>{question?.hint}</Typography>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6">
                    {question.type === 'result' &&
                      `The fair value of this market is $${question.trueValue}.`}
                  </Typography>
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
                {question.type === 'round' && (
                  <BidAskPanel
                    position={position}
                    teamId={myTeamId}
                    teamName={teams[myTeamId]?.name}
                    balance={
                      teams[myTeamId]?.teamAnswers[marketPosition].balance
                    }
                    contracts={
                      teams[myTeamId]?.teamAnswers[marketPosition].contracts
                    }
                  />
                )}
                <Grid container columns={12} spacing={3} sx={{ py: 3 }}>
                  {question.type === 'result' &&
                    processResults(teams).map((team, index) => {
                      return (
                        <Grid
                          item
                          xs={12}
                          md={6}
                          lg={4}
                          key={index}
                          sx={{ display: 'flex', justifyContent: 'center' }}
                        >
                          <FormControl sx={{ width: '100%' }}>
                            <TeamStats
                              key={team.teamId}
                              teamName={team.teamName}
                              balance={team.balance}
                              contracts={team.contracts}
                              trueValue={team.trueValue}
                              isWinner={team.isWinner}
                            />
                          </FormControl>
                        </Grid>
                      );
                    })}
                </Grid>
              </>
            ))}
        </Box>
      </Box>
    </Box>
  );
};
export default PlayGamePage;
