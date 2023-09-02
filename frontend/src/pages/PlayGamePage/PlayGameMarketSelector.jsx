import { Box, InputLabel, Select, FormControl, MenuItem } from '@mui/material';

const PlayGameMarketSelector = ({ current, setSelectedMarketIndex }) => {
  return (
    <Box sx={{ maxWidth: 500, mt: 5, mb: 3, mx: 'auto' }}>
      <FormControl fullWidth>
        <InputLabel htmlFor="uncontrolled-select">Market</InputLabel>
        <Select
          defaultValue={0}
          label="Market"
          id="uncontrolled-select"
          onChange={(event) => {
            setSelectedMarketIndex(event.target.value);
          }}
        >
          {current?.round &&
            Object.keys(current.round).map((market, index) => (
              <MenuItem key={index} value={index}>
                {market}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </Box>
  );
};
export default PlayGameMarketSelector;
