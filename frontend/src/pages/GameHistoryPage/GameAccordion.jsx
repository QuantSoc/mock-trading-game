import React from 'react';
import { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Box,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Divider,
} from '@mui/material';
import SessionAccordion from './SessionAccordion';

const GameAccordion = ({ gameName, creationDate, sessions }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <Box sx={{ mb: 2 }}>
      <Accordion
        expanded={expanded}
        onClick={() => setExpanded((prev) => !prev)}
        sx={{ border: '0.5px solid #EAEAEA' }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              pr: 1,
            }}
          >
            <Typography>{gameName}</Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              {new Date(creationDate).toLocaleString()}
            </Typography>
          </Box>
        </AccordionSummary>
        <Divider sx={{ my: 1 }} />
        <AccordionDetails onClick={(e) => e.stopPropagation()}>
          {sessions.length < 1 && (
            <Typography textAlign="center" color="text.secondary">
              No sessions yet...
            </Typography>
          )}
          {sessions?.map((session, index) => {
            return (
              <SessionAccordion
                key={`session-history-accordion-${index}`}
                sessionId={session.id}
                timeStarted={session.timeStarted}
              />
            );
          })}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default GameAccordion;
