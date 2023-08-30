import { Button, Box, Divider, Typography } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import PaidTwoToneIcon from '@mui/icons-material/PaidTwoTone';
import RequestPageTwoToneIcon from '@mui/icons-material/RequestPageTwoTone';

const TeamPanel = ({ teamName, balance, contracts, latestBid, latestAsk }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: 3,
        boxShadow: 3,
        borderRadius: 3,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <GroupIcon fontSize="large" sx={{ mr: 1 }} />
        {teamName}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography
        variant="h6"
        sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
        fontFamily={'monospace'}
      >
        <PaidTwoToneIcon fontSize="large" sx={{ mr: 1 }} />
        {balance.toFixed(2)}
      </Typography>
      <Typography
        variant="h6"
        sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
        fontFamily={'monospace'}
      >
        <RequestPageTwoToneIcon
          fontSize="large"
          color="primary"
          sx={{ mr: 1 }}
        />
        {contracts} contracts
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <Button
          variant={latestBid ? 'contained' : 'outlined'}
          color="success"
          sx={{ fontSize: 18, mr: 1 }}
        >
          Bid: ${latestBid ? latestBid : '  -'}
        </Button>
        <Button
          variant={latestAsk ? 'contained' : 'outlined'}
          color="error"
          sx={{ fontSize: 18, ml: 1 }}
        >
          Ask: ${latestAsk ? latestAsk : '  -'}
        </Button>
      </Box>
    </Box>
  );
};
export default TeamPanel;
