import { Box, Divider, Typography } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import PaidTwoToneIcon from '@mui/icons-material/PaidTwoTone';
import RequestPageTwoToneIcon from '@mui/icons-material/RequestPageTwoTone';
import SavingsTwoToneIcon from '@mui/icons-material/SavingsTwoTone';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const TradePanel = ({ teamName, balance, contracts, total, isWinner }) => {
  return (
    <Box
      sx={{
        backgroundColor: 'white',
        boxShadow: 3,
        borderRadius: 3,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 auto',
        border: isWinner && '1px solid limegreen',
      }}
    >
      <EmojiEventsIcon
        fontSize="large"
        sx={{
          color: 'gold',
          mx: 'auto',
          mb: 1,
          visibility: isWinner ? 'visible' : 'hidden',
        }}
      />
      <Typography
        variant="h5"
        sx={{
          // width: { xs: 2, sm: 100, md: 150, lg: 170 },
          // textOverflow: 'ellipsis',
          // overflow: 'hidden',
          // whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          wordBreak: 'break-all',
        }}
      >
        <GroupIcon fontSize="large" sx={{ mr: 1 }} />
        {teamName}
      </Typography>
      <Box sx={{ mb: 2 }}>
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
        <Typography
          variant="h6"
          sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
          fontFamily={'monospace'}
        >
          <SavingsTwoToneIcon fontSize="large" color="success" sx={{ mr: 1 }} />
          ${total.toFixed(2)} in total
        </Typography>
      </Box>
    </Box>
  );
};
export default TradePanel;
