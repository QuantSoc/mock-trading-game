import { Box, Typography, Grid, TextField, Button } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useEffect, useState } from 'react';
import { fetchAPIRequest } from '../helpers';
import { useParams } from 'react-router-dom';

const AdminSessionPage = () => {
  const [joinedTeams, setJoinedTeams] = useState([]);
  const { sessionId } = useParams();
  const [sessionStatus, setSessionStatus] = useState({});
  const [statusInterval, setStatusInterval] = useState('');
  useEffect(() => {
    const getGameStatus = async () => {
      const status = await fetchAPIRequest(
        `/admin/session/${sessionId}/status`,
        'GET'
      );
      setSessionStatus(status.status);
    };

    setStatusInterval(
      setInterval(() => {
        getGameStatus();
      }, 2000)
    );
  }, [sessionId]);

  useEffect(() => {
    const newTeams =
      sessionStatus.teams &&
      Object.keys(sessionStatus.teams).map(
        (teamId) => sessionStatus.teams[teamId].name
      );
    if (newTeams?.toString() !== joinedTeams?.toString()) {
      setJoinedTeams(newTeams);
    }
  }, [sessionStatus, joinedTeams]);

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
                label="Description"
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
        <Typography variant="h5">Session Overview</Typography>
        {markets}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
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
            sx={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}
          >
            <AdminPanelSettingsIcon sx={{ width: 50, height: 50 }} />
            Session Controls
          </Typography>
          <Button variant="contained" size="large" sx={{ my: 2 }}>
            Start Game
          </Button>
        </Box>
        <Typography variant="h5">Players</Typography>
        <Grid
          container
          columns={{ xs: 2, sm: 8, md: 12, lg: 16 }}
          spacing={3}
          sx={{ p: 5 }}
        >
          {joinedTeams?.map((team, index) => {
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

        {renderQuestions(sessionStatus.questions)}
        {/* <Box
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
        </Box> */}
      </Box>
    </Box>
  );
};
export default AdminSessionPage;
