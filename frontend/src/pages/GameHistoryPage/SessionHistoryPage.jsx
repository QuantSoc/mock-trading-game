import React, { useState, useEffect } from 'react';
import { Box, Typography, Skeleton, Divider } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import { fetchAPIRequest } from '../../helpers';
import { useParams } from 'react-router-dom';
import QuestionAccordion from './QuestionAccordion';

const SessionHistoryPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [sessionData, setSessionData] = useState([]);
  const { sessionId } = useParams();

  useEffect(() => {
    const fetchGames = async () => {
      const data = await fetchAPIRequest(`/history/${sessionId}`, 'GET');
      setSessionData(data);
      setIsLoading(false);
    };

    fetchGames();
  }, [sessionId]);

  return (
    <Box
      className="responsive-pad"
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
          borderRadius: '10px 10px 0px 0px',
          boxShadow: 3,
          px: { xs: 2, sm: 5 },
          py: 7,
        }}
      >
        <Typography
          variant="h4"
          sx={{ display: 'flex', alignItems: 'center', mb: 3 }}
        >
          <HistoryIcon sx={{ width: 35, height: 35, mr: 1.5 }} />
          Session History: {sessionId}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-around', my: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ display: 'flex' }}>
              Started:
            </Typography>
            <Typography color="text.secondary">
              {new Date(sessionData.timeStarted).toLocaleString()}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ display: 'flex' }}>
              Ended:
            </Typography>
            <Typography color="text.secondary">
              {new Date(
                sessionData.isoTimeLastQuestionStarted
              ).toLocaleString()}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h5" sx={{ mb: 2 }}>
          Rounds
        </Typography>
        {sessionData?.questions?.map((question, index) => {
          return (
            <QuestionAccordion
              key={`question-history-accordion-${index}`}
              qIndex={index}
              marketName={question?.name}
              type={question.type[0].toUpperCase() + question.type.slice(1)}
              hint={question?.hint}
              round={question?.round}
              teams={sessionData?.teams}
              trueValue={question?.trueValue}
            />
          );
        })}
        {isLoading &&
          Array.from({ length: 5 }, (_, index) => (
            <Skeleton
              variant="rounded"
              width="100%"
              height={48}
              sx={{ mb: 2 }}
              key={index}
            />
          ))}
      </Box>
    </Box>
  );
};

export default SessionHistoryPage;
