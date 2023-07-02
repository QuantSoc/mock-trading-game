import { useParams } from 'react-router-dom';
import { fetchAPIRequest } from '../helpers';
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  TextField,
  Typography,
  Grid,
  LinearProgress,
} from '@mui/material';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import { BidAskPanel, TradePanel } from '../components/index.js';

const PlayGamePage = () => {
  const { sessionId } = useParams();
  const [teamName, setTeamName] = useState('');
  const [myTeamId, setMyTeamId] = useState('');

  const [position, setPosition] = useState(-1);
  const [question, setQuestion] = useState({});
  const [teams, setTeams] = useState({});
  const [marketPosition, setMarketPosition] = useState(0);

  const createTeam = async () => {
    const teamData = await fetchAPIRequest(`/game/join/${sessionId}`, 'POST', {
      name: teamName,
    });
    setMyTeamId(teamData.teamId);
    localStorage.setItem('localTeamId', teamData.teamId);
  };

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
        px: { xs: 1, sm: 10, md: 18, lg: 25 },
      }}
    >
      <Box
        sx={{
          backgroundColor: '#fff',
          flexGrow: 1,
          borderRadius: '20px 20px 0px 0px',
          boxShadow: 3,
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
        <Box>
          {position < 0 ? (
            <>
              <Typography
                variant="h5"
                sx={{ display: 'flex', alignItems: 'center', my: 2 }}
              >
                <CircularProgress sx={{ mr: 2 }} />
                Waiting for session to start
              </Typography>
              <Typography autoFocus variant="h5" sx={{ mt: 3 }}>
                Set a team name:
              </Typography>
              <TextField
                label="Team Name"
                onChange={(event) => setTeamName(event.target.value)}
              />
              <Button onClick={createTeam}>Create Team</Button>
            </>
          ) : !myTeamId ? (
            <Typography variant="h4" color="text.secondary">
              Session already started...
            </Typography>
          ) : (
            <>
              <Box
                sx={{
                  boxShadow: 3,
                  borderRadius: 5,
                  width: { xs: '80%', md: '50%' },
                  height: 'fit-content',
                  py: 4,
                  px: 4,
                  mx: 'auto',
                  mb: 5,
                }}
              >
                <Typography
                  variant="h5"
                  color="text.secondary"
                  sx={{ float: 'right' }}
                >
                  {position.toString()}
                </Typography>
                <Typography variant="h4">
                  {question?.type[0].toUpperCase() + question?.type.slice(1)}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {question?.name}
                </Typography>
                <Typography variant="h6">{question?.hint}</Typography>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h5">
                  {question.type === 'result' &&
                    `The fair value of this market is $${question.trueValue}.`}
                </Typography>
                {/* <Typography variant="h6">
                  {question.type !== 'round' &&
                    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis officia odit nulla aliquid consequuntur id unde doloribus impedit quia tempora debitis ut et labore ex hic, officiis, sequi magni odio.'}
                </Typography> */}
                <Typography variant="h5">
                  {question.type === 'trade' &&
                    'Trading is in session. Please wait for the trades to complete.'}
                  {question.type === 'trade' && (
                    <LinearProgress sx={{ mt: 1 }} />
                  )}
                </Typography>
              </Box>
              {question.type === 'round' && (
                <BidAskPanel
                  teamId={myTeamId}
                  teamName={teams[myTeamId]?.name}
                  balance={teams[myTeamId]?.teamAnswers[marketPosition].balance}
                  contracts={
                    teams[myTeamId]?.teamAnswers[marketPosition].contracts
                  }
                />
              )}
              <Grid
                container
                columns={{ xs: 2, sm: 8, md: 12, lg: 16 }}
                spacing={3}
                sx={{ py: 3 }}
              >
                {question.type === 'result' &&
                  processResults(teams).map((team, index) => {
                    return (
                      <Grid
                        item
                        xs={2}
                        sm={4}
                        md={4}
                        key={index}
                        sx={{ display: 'flex', justifyContent: 'center' }}
                      >
                        <TradePanel
                          key={team.teamId}
                          teamName={team.teamName}
                          balance={team.balance}
                          contracts={team.contracts}
                          total={team.total}
                          isWinner={team.isWinner}
                        />
                      </Grid>
                    );
                  })}
              </Grid>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};
export default PlayGamePage;
