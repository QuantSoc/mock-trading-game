import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import RequestPageOutlinedIcon from '@mui/icons-material/RequestPageOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PriceChangeOutlinedIcon from '@mui/icons-material/PriceChangeOutlined';

const TeamStats = ({
  teamName,
  bid,
  ask,
  balance,
  contracts,
  trueValue,
  isWinner,
}) => {
  return (
    <Box
      sx={{
        borderRadius: '10px',
        p: 2,
        border: '0.5px solid',
        borderColor: isWinner ? 'limegreen' : '#E0E0E0',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          fontWeight={500}
          sx={{
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <GroupIcon fontSize="small" sx={{ mr: 1 }} />
          {teamName}
        </Typography>
        <EmojiEventsIcon
          // fontSize="large"
          sx={{
            color: 'gold',
            mb: 1,
            visibility: isWinner ? 'visible' : 'hidden',
          }}
        />
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
        <Typography sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PaidOutlinedIcon sx={{ mr: 1 }} />
          {balance?.toFixed(2)}
        </Typography>
        <Typography
          variant="h6"
          fontSize={16}
          sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
        >
          <RequestPageOutlinedIcon color="primary" sx={{ mr: 1 }} />
          {`${contracts} `}
          <Typography color="text.secondary" sx={{ ml: 1 }}>
            contracts
          </Typography>
        </Typography>
      </Box>
      {!trueValue && (
        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <Typography
            color={bid && 'error'}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <ArrowDropDownOutlinedIcon color="error" fontSize="large" />
            Bid {bid ? bid.toFixed(2) : '--'}
          </Typography>
          <Typography
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: ask && '#2e7d32',
            }}
          >
            <ArrowDropUpOutlinedIcon color="success" fontSize="large" />
            Ask {ask ? ask.toFixed(2) : '--'}
          </Typography>
        </Box>
      )}
      {!!trueValue && (
        <Typography
          variant="h6"
          fontSize={16}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 2,
          }}
        >
          <PriceChangeOutlinedIcon color="success" sx={{ mr: 1 }} />
          <Typography color="text.secondary" sx={{ mr: 2 }}>
            Total
          </Typography>
          {`$${(trueValue * contracts + balance).toFixed(2)} `}
        </Typography>
      )}
    </Box>
  );
};

export default TeamStats;
