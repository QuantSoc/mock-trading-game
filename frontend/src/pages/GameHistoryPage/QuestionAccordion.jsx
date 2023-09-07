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
import AdminSessionTradeArea from '../AdminSessionPage/AdminSessionTradeArea';

const QuestionAccordion = ({
  qIndex,
  marketName,
  markets,
  type,
  teams,
  trueValueMarkets,
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
              {/* {!!round && round} */}
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
              Object.keys(markets).map((market, index) => (
                <Box key={'box' + index}>
                  <Typography
                    key={'market' + index}
                    sx={{ mt: 3, mb: 1, fontSize: 18 }}
                  >
                    {market}
                  </Typography>
                  <AdminSessionTradeArea
                    key={'history' + index}
                    teams={teams}
                    position={qIndex}
                    selectedMarketIndex={index}
                    trueValue={parseInt(
                      Object.values(trueValueMarkets)[index],
                      10
                    )}
                  />
                </Box>
              ))
            )}
          </AccordionDetails>
        )}
      </Accordion>
      {type === 'Result' && <Divider sx={{ my: 4 }} />}
    </Box>
  );
};

export default QuestionAccordion;
