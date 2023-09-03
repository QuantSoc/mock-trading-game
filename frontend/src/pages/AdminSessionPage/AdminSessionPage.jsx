import {
  Box,
  Typography,
  Grid,
  TextField,
  CircularProgress,
  Skeleton,
  LinearProgress,
  FormControl,
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useEffect, useState, useContext } from 'react';
import { fetchAPIRequest } from '../../helpers';
import { useParams } from 'react-router-dom';
import AdvanceGameBtn from '../../components/AdvanceGameBtn';
import TeamStats from '../GameHistoryPage/TeamStats';
import { AlertContext } from '../../contexts/NotificationContext';
import { EditGameSection } from '../EditGamePage';
import AdminSessionQuestionCard from './AdminSessionQuestionCard';
import AdminSessionTradeArea from './AdminSessionTradeArea';

const AdminSessionPage = () => {
  const { gameId } = useParams();
  const { sessionId } = useParams();
  const [session, setSession] = useState({});
  const [marketPosition, setMarketPosition] = useState(0);
  const [position, setPosition] = useState(0);
  // const [isActive, setIsActive] = useState(false);
  const [hasTraded, setHasTraded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSessionStart, setIsSessionStart] = useState(false);
  const [current, setCurrent] = useState({});
  const alertCtx = useContext(AlertContext);
  const [gameData, setGameData] = useState({});

  const [selectedMarketIndex, setSelectedMarketIndex] = useState(0);

  useEffect(() => {
    const fetchGameData = async () => {
      const data = await fetchAPIRequest(`/games/${gameId}`, 'GET');
      setGameData(data);
    };
    fetchGameData();
  }, [gameId]);

  const processResults = (teams, marketIndex) => {
    const teamResults = Object.keys(teams)
      .map((teamId, index) => {
        const trueValue = Object.values(
          session.questions[session.position].round
        )[marketIndex];
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
    const getGameStatus = async (gameInterval) => {
      const status = await fetchAPIRequest(
        `/admin/session/${sessionId}/status`,
        'GET'
      );

      if (status.status.questions.length <= 0) {
        alertCtx.error('This game has no markets. Please create some.');
        clearTimeout(gameInterval);
        return;
      }

      if (status.status.position >= 0) {
        setIsSessionStart(true);
      }

      setSession(status.status);
      setIsLoading(false);
      if (
        status.status.position >= 0 &&
        status.status.questions[status.status.position]?.type === 'market'
      ) {
        setMarketPosition(status.status.position);
      }
      setPosition(status.status.position);
      setCurrent(status.status.questions[status.status.position]);
    };
    const gameInterval = setInterval(() => {
      getGameStatus(gameInterval);
    }, 1000);
    return () => clearInterval(gameInterval);
  }, [sessionId, alertCtx]);

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
              borderRadius: '10px',
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
        <Typography variant="h5" sx={{ mb: 1, fontSize: { xs: 16, md: 24 } }}>
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
        {gameData.sections?.map((section, index) => {
          return (
            <EditGameSection
              key={index}
              section={section}
              setGameSections={() => {}}
              setIsSaved={() => {}}
              isDisabled
              index={index}
            />
          );
        })}
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
      }}
    >
      <Box
        sx={{
          backgroundColor: '#fff',
          flexGrow: 1,
          borderRadius: '10px 10px 0px 0px',
          boxShadow: 1,
          width: '100%',
          px: { xs: 2, sm: 2, lg: 2, xl: 5 },
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
                    fontSize: { xs: 24, md: 34 },
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
                  isDisabled={current?.type === 'round' && !hasTraded}
                  unsetTradeBtn={() => setHasTraded(false)}
                />
              </Box>
              <AdminSessionQuestionCard
                current={current}
                position={position}
                hasTraded={hasTraded}
                initiateTrade={initiateTrade}
                setHasTraded={setHasTraded}
                selectedMarketIndex={selectedMarketIndex}
              />
              {/* {current?.type !== 'section' && (
                <AdminSessionMarketSelector
                  current={current}
                  setSelectedMarketIndex={setSelectedMarketIndex}
                />
              )} */}
              {/* {current?.type === 'round' && (
                <AdminSessionTradeArea
                  teams={session.teams}
                  position={position}
                  selectedMarketIndex={selectedMarketIndex}
                />
              )} */}

              <Grid
                container
                columns={24}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                sx={{ mt: 4 }}
              >
                {current?.type === 'round' &&
                  Object.keys(current.round).map((market, index) => {
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
                        <Typography sx={{ mb: 1, fontSize: 18 }}>
                          {market}
                        </Typography>
                        <AdminSessionTradeArea
                          key={index}
                          teams={session.teams}
                          position={position}
                          marketName={market}
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
                {current?.type === 'result' &&
                  Object.keys(current.round).map((market, marketIndex) => {
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
                        <Typography sx={{ mb: 1, fontSize: 18 }}>
                          {market}
                        </Typography>
                        <Grid container columns={12} spacing={1}>
                          {processResults(session.teams, marketIndex).map(
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

              {/* <Grid container columns={12} spacing={3} sx={{ py: 3 }}>
                {current?.type === 'result' &&
                  processResults(session.teams).map((team, index) => {
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
                  })}
              </Grid> */}
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
                    fontSize: { xs: 24, md: 34 },
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
              <Typography variant="h5" sx={{ fontSize: { xs: 16, md: 24 } }}>
                Players
              </Typography>
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
                    <Typography
                      variant="h5"
                      sx={{ fontSize: { xs: 16, md: 24 } }}
                    >
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
                              borderRadius: '10px',
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
