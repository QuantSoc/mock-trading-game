import { Box } from '@mui/material';
import { BidAskPanel } from '../../components';

const PlayGameTradeArea = ({
  current,
  position,
  teams,
  myTeamId,
  selectedMarketIndex,
}) => {
  return (
    <Box>
      <BidAskPanel
        position={position}
        teamId={myTeamId}
        teamName={teams[myTeamId]?.name}
        balance={
          teams[myTeamId]?.teamAnswers[position].markets[selectedMarketIndex]
            .balance
        }
        contracts={
          teams[myTeamId]?.teamAnswers[position].markets[selectedMarketIndex]
            .contracts
        }
        lastBid={
          teams[myTeamId]?.teamAnswers[position].markets[selectedMarketIndex]
            .bid
        }
        lastAsk={
          teams[myTeamId]?.teamAnswers[position].markets[selectedMarketIndex]
            .ask
        }
        marketIndex={selectedMarketIndex}
      />
    </Box>
  );
};
export default PlayGameTradeArea;
