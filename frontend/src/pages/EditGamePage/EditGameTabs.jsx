import { useState, useEffect } from 'react';
import { Box, Tabs, Tab } from '@mui/material';

const EditGameTabs = ({
  markets,
  selectedMarketIndex,
  setSelectedMarketIndex,
}) => {
  const [value, setValue] = useState(
    selectedMarketIndex < markets.length ? selectedMarketIndex : 0
  );
  useEffect(() => {
    setValue(selectedMarketIndex < markets.length ? selectedMarketIndex : 0);
  }, [selectedMarketIndex, setValue, markets]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSelectedMarketIndex(newValue);
  };

  return (
    markets.length > 0 && (
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="primary"
          indicatorColor="secondary"
          aria-label="game section tabs"
        >
          {markets.map((market, index) => (
            <Tab key={market.name + index} value={index} label={market.name} />
          ))}
        </Tabs>
      </Box>
    )
  );
};
export default EditGameTabs;
