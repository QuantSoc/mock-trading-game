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
  Grid,
} from '@mui/material';
import TeamStats from './TeamStats';

const QuestionAccordion = ({
  qIndex,
  marketName,
  round,
  type,
  teams,
  trueValue,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box sx={{ mb: 2 }}>
      <Accordion
        expanded={expanded}
        onClick={() => setExpanded((prev) => !prev)}
        sx={{
          border: '0.5px solid',
          borderColor: type === 'Result' ? 'gold' : '#EAEAEA',
        }}
      >
        <AccordionSummary expandIcon={!marketName && <ExpandMoreIcon />}>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              pr: 1,
            }}
          >
            <Typography>{type}</Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              {!!round && round}
              {!!marketName && marketName}
            </Typography>
          </Box>
        </AccordionSummary>
        {!marketName && <Divider sx={{ my: 1 }} />}
        {!marketName && (
          <AccordionDetails onClick={(e) => e.stopPropagation()}>
            {Object.keys(teams).length < 1 ? (
              <Typography textAlign="center">No teams...</Typography>
            ) : (
              <Grid
                container
                columnSpacing={5}
                rowSpacing={5}
                columns={12}
                sx={{ gridAutoFlow: 'column' }}
              >
                {!!teams &&
                  Object.keys(teams).map((teamId, index) => {
                    const curr = teams[teamId].teamAnswers;
                    return (
                      <Grid
                        key={`team-stats-grid-${index}`}
                        item
                        xs={12}
                        md={6}
                        xl={4}
                      >
                        <TeamStats
                          key={`team-stats-${index}`}
                          teamName={teams[teamId].name}
                          bid={curr[qIndex]?.bid}
                          ask={curr[qIndex]?.ask}
                          balance={curr[qIndex].balance}
                          contracts={curr[qIndex]?.contracts}
                          isWinner={curr[qIndex]?.isWinner}
                          trueValue={trueValue}
                        />
                      </Grid>
                    );
                  })}
              </Grid>
            )}
          </AccordionDetails>
        )}
      </Accordion>
      {type === 'Result' && <Divider sx={{ my: 4 }} />}
    </Box>
  );
};

export default QuestionAccordion;
