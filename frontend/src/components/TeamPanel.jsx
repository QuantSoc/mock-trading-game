import { Box, Typography } from '@mui/material';

const TeamPanel = ({ teamName, balance, contracts, latestBid, latestAsk }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderTop: '0.5px solid #ccc',
        borderBottom: '0.5px solid #ccc',
      }}
    >
      <Typography variant="h5">{teamName}</Typography>
      <Typography variant="h6">Balance: ${balance}</Typography>
      <Typography variant="h6">Contracts: {contracts}</Typography>
      <Typography variant="h6">Bid: ${latestBid}</Typography>
      <Typography variant="h6">Ask: ${latestAsk}</Typography>
    </Box>
  );
};
export default TeamPanel;
