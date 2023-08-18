import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Divider,
  Skeleton,
  LinearProgress,
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useEffect, useState } from 'react';
import { fetchAPIRequest } from '../helpers';
import { useParams } from 'react-router-dom';
import AdvanceGameBtn from '../components/AdvanceGameBtn';
import { TeamPanel } from '../components';
import { TradePanel } from '../components';

const AdminSessionPage = () => {
  const { gameId } = useParams();
  const { sessionId } = useParams();
  const [session, setSession] = useState({});
  const [marketPosition, setMarketPosition] = useState(0);
  // const [isActive, setIsActive] = useState(false);
  const [hasTraded, setHasTraded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSessionStart, setIsSessionStart] = useState(false);

  const processTeams = () => {
    return Object.keys(session.teams).map((teamId) => {
      return (
        <Grid
          item={true}
          xs={2}
          sm={4}
          md={4}
          key={teamId + 'item'}
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          <TeamPanel
            key={teamId}
            teamName={session.teams[teamId].name}
            balance={session.teams[teamId].teamAnswers[marketPosition].balance}
            contracts={
              session.teams[teamId].teamAnswers[marketPosition].contracts
            }
            latestBid={session.teams[teamId].teamAnswers[session.position]?.bid}
            latestAsk={session.teams[teamId].teamAnswers[session.position]?.ask}
          />
        </Grid>
      );
    });
  };
  const processResults = (teams) => {
    const teamResults = Object.keys(teams)
      .map((teamId, index) => {
        const trueValue = session.questions[session.position]?.trueValue;
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
    const saveWinner = async (winnerRes) => {
      await fetchAPIRequest(`/session/${sessionId}/result`, 'POST', {
        position: session.position,
        teamId: winnerRes.teamId,
        isWinner: winnerRes.total === winningTotal,
      });
    };

    return teamResults.map((result) => {
      session.active && saveWinner(result);
      return { ...result, isWinner: result.total === winningTotal };
    });
  };
  const initiateTrade = async () => {
    await fetchAPIRequest(`/session/${sessionId}/trade`, 'POST', {
      marketPos: marketPosition,
    });
  };
  useEffect(() => {
    const getGameStatus = async () => {
      const status = await fetchAPIRequest(
        `/admin/session/${sessionId}/status`,
        'GET'
      );

      if (status.status.position >= 0) {
        setIsSessionStart(true);
      }

      setSession(status.status);
      setIsLoading(false);
      if (
        status.status.position >= 0 &&
        status.status.questions[status.status.position].type === 'market'
      ) {
        setMarketPosition(status.status.position);
      }
      if (
        status.status.position >= 0 &&
        status.status.questions[status.status.position].type === 'round'
      ) {
        setHasTraded(false);
      }

      // setIsActive(status.status.active);
    };
    setInterval(() => {
      getGameStatus();
    }, 1000);
  }, [sessionId]);

  const renderQuestions = (questions) => {
    const markets = [];
    let tempRounds = [];
    questions?.forEach((question, index) => {
      if (question.type === 'market') {
        tempRounds = [];
        markets.push(
          <Box
            key={'market-' + index}
            sx={{
              px: 2,
              pt: 3,
              pb: 2,
              mb: 3,
              border: '1px solid lightgray',
              borderRadius: 3,
            }}
          >
            <TextField
              key={'market-label-' + index}
              label="Market Name"
              fullWidth
              value={question.name}
            />
            {tempRounds}
          </Box>
        );
      } else if (question.type === 'round') {
        tempRounds.push(
          <Box key={'round-box-' + index} sx={{ py: 2, pl: 4 }}>
            <Typography key={'round-text-' + index}>
              {`Round ${tempRounds.length + 1}`}
            </Typography>
            <Box
              key={'round-text-box-' + index}
              sx={{ display: 'flex', pt: 1 }}
            >
              <TextField
                key={'round-text-field-' + index}
                label="Hint"
                fullWidth
                value={question.hint}
              />
            </Box>
          </Box>
        );
      }
    });

    return (
      <Box>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Session Overview
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
        {markets}
      </Box>
    );
  };

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
        {!isLoading &&
          (isSessionStart ? (
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  mb: 5,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <AdminPanelSettingsIcon sx={{ width: 50, height: 50 }} />
                  Session Controls
                </Typography>
                <AdvanceGameBtn
                  gameId={gameId}
                  isSessionStart={isSessionStart}
                  setIsSessionStart={setIsSessionStart}
                  isEnd={session.position === session.questions.length - 1}
                />
              </Box>
              <Box
                sx={{
                  boxShadow: 3,
                  borderRadius: 5,
                  width: { xs: '70%', md: '50%' },
                  height: 'fit-content',
                  py: 4,
                  px: 4,
                  mx: 'auto',
                  border:
                    session.questions[session.position]?.type === 'result' &&
                    '2px solid gold',
                }}
              >
                <Typography
                  variant="h5"
                  color="text.secondary"
                  sx={{ float: 'right' }}
                >
                  {session.position.toString()}
                </Typography>
                <Typography variant="h4">
                  {session.questions[session.position]?.type[0].toUpperCase() +
                    session.questions[session.position]?.type.slice(1)}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6">
                  {session.questions[session.position]?.name}
                </Typography>
                <Typography variant="h6">
                  {session.questions[session.position]?.hint}
                </Typography>
                <Typography variant="h6">
                  {session.questions[session.position]?.type === 'result' &&
                    'Please view the results below.'}
                </Typography>
                {session.questions[session.position]?.type === 'round' && (
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography variant="h6">
                      Click the button to begin trading
                    </Typography>
                    <Button
                      variant="contained"
                      disabled={hasTraded}
                      onClick={() => {
                        initiateTrade();
                        setHasTraded(true);
                      }}
                      size="large"
                      sx={{ maxWidth: '30%', mt: 2 }}
                    >
                      Trade
                    </Button>
                  </Box>
                )}
              </Box>
              {session.questions[session.position]?.type !== 'result' && (
                <Grid
                  container
                  columns={{ xs: 2, sm: 8, md: 12, lg: 16 }}
                  spacing={3}
                  sx={{ p: 5 }}
                >
                  {processTeams()}
                </Grid>
              )}
              <Grid
                container
                columns={{ xs: 2, sm: 8, md: 12, lg: 16 }}
                spacing={3}
                sx={{ py: 3 }}
              >
                {session.questions[session.position]?.type === 'result' &&
                  processResults(session.teams).map((team, index) => {
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
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  mb: 5,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <AdminPanelSettingsIcon sx={{ width: 50, height: 50 }} />
                  Session Controls
                </Typography>
                <AdvanceGameBtn
                  gameId={gameId}
                  isSessionStart={isSessionStart}
                  setIsSessionStart={setIsSessionStart}
                />
              </Box>
              <Typography variant="h5">Players</Typography>
              <Grid
                container
                columns={{ xs: 2, sm: 8, md: 12, lg: 16 }}
                spacing={3}
                sx={{ p: 5 }}
              >
                {(isLoading ||
                  (session.teams &&
                    Object.keys(session.teams).length === 0)) && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <CircularProgress sx={{ mr: 3 }} />
                    <Typography variant="h5">
                      {isLoading ? 'Loading...' : 'Waiting for Participants'}
                    </Typography>
                  </Box>
                )}
                {session.teams &&
                  Object.keys(session?.teams)
                    .map((teamId) => session.teams[teamId].name)
                    .map((team, index) => {
                      return (
                        <Grid
                          item
                          xs={2}
                          sm={4}
                          md={4}
                          key={index}
                          sx={{ display: 'flex', justifyContent: 'center' }}
                        >
                          <Box
                            sx={{
                              boxShadow: 2,
                              borderRadius: 2,
                              px: 3,
                              py: 2,
                              display: 'flex',
                              flexGrow: 1,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <Typography variant="h6" key={index}>
                              {team}
                            </Typography>
                          </Box>
                        </Grid>
                      );
                    })}
              </Grid>

              {renderQuestions(session.questions)}
            </>
          ))}
      </Box>
    </Box>
  );
};
export default AdminSessionPage;
