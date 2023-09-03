import { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import EditGameTabs from './EditGameTabs';
import EditGameMarket from './EditGameMarket';

const MARKET_PAYLOAD = {
  rounds: [],
};

const EditGameSection = ({
  section,
  index,
  setGameSections,
  setIsSaved,
  isDisabled,
}) => {
  const [selectedMarketIndex, setSelectedMarketIndex] = useState(0);
  const [markets, setMarkets] = useState(section.markets);
  useEffect(() => {
    if (isDisabled) {
      return () => {};
    }
    setIsSaved(false);
    // save section changes
    setGameSections((sections) => {
      return sections.map((section, sIndex) => {
        if (sIndex === index) {
          section.markets = markets;
        }
        return section;
      });
    });
  }, [markets, setIsSaved, setGameSections, index, isDisabled]);

  return (
    <Box
      sx={{
        px: 2,
        pt: 2,
        pb: 2,
        mb: 3,
        border: '1px solid lightgray',
        borderRadius: 3,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h6">Section {index + 1}</Typography>
        {!isDisabled && (
          <Button
            color="error"
            size="small"
            onClick={() => {
              setGameSections((sections) => {
                sections.splice(index, 1);
                return [...sections];
              });
            }}
            disabled={isDisabled}
            sx={{ py: 1, opacity: 0.7 }}
          >
            Delete Section
          </Button>
        )}
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          my: 1,
        }}
      >
        <EditGameTabs
          markets={markets}
          selectedMarketIndex={selectedMarketIndex}
          setSelectedMarketIndex={setSelectedMarketIndex}
        />
        {!isDisabled && (
          <Button
            startIcon={<ShowChartIcon />}
            disabled={isDisabled}
            onClick={() => {
              // let newRounds = [];
              // let globalRoundsLength = markets.slice(-1)[0]?.rounds.length;
              // if (markets.length > 0 && globalRoundsLength > 0) {
              //   newRounds = Array.from({ length: globalRoundsLength }, () => {
              //     return { hint: '' };
              //   });
              // }
              // markets.push({
              //   name: `New Market ${markets.length + 1}`,
              //   trueValue: 0,
              //   rounds: newRounds,
              // });
              const newMarket = { ...MARKET_PAYLOAD };
              newMarket.name = `New Market ${markets.length + 1}`;
              newMarket.trueValue = 0;
              markets.push(newMarket);
              setMarkets([...markets]);
            }}
          >
            New Market
          </Button>
        )}
      </Box>

      {markets.length > 0 && (
        <EditGameMarket
          name={markets[selectedMarketIndex].name}
          rounds={markets[selectedMarketIndex].rounds}
          trueValue={markets[selectedMarketIndex]?.trueValue}
          selectedMarketIndex={selectedMarketIndex}
          setSelectedMarketIndex={setSelectedMarketIndex}
          markets={markets}
          setMarkets={setMarkets}
          isDisabled={isDisabled}
        />
      )}
    </Box>
  );
};
export default EditGameSection;
