import { BidAskPanel } from '../../components';

const PlayGameTradeArea = ({
  current,
  position,
  teams,
  myTeamId,
  selectedMarketIndex,
}) => {
  return (
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
        teams[myTeamId]?.teamAnswers[position].markets[selectedMarketIndex].bid
      }
      lastAsk={
        teams[myTeamId]?.teamAnswers[position].markets[selectedMarketIndex].ask
      }
      marketIndex={selectedMarketIndex}
      hasTraded={current.hasTraded}
    />
  );
};
export default PlayGameTradeArea;
