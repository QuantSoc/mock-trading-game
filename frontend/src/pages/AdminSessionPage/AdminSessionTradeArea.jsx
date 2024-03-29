import { Box, Grid, FormControl } from '@mui/material';
import TeamStats from '../GameHistoryPage/TeamStats';

const AdminSessionTradeArea = ({
  teams,
  position,
  selectedMarketIndex,
  trueValue,
}) => {
  const processTeams = (marketIndex) => {
    return Object.keys(teams).map((teamId) => {
      return (
        <Grid
          item={true}
          xs={12}
          sm={6}
          md={6}
          lg={6}
          key={teamId + 'item'}
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          <FormControl sx={{ width: '100%' }}>
            <TeamStats
              key={`team-stats-${teamId}`}
              teamName={teams[teamId].name}
              balance={
                teams[teamId].teamAnswers[position].markets[marketIndex].balance
              }
              contracts={
                teams[teamId].teamAnswers[position].markets[marketIndex]
                  .contracts
              }
              bid={
                teams[teamId].teamAnswers[position].markets[marketIndex]?.bid
              }
              ask={
                teams[teamId].teamAnswers[position].markets[marketIndex]?.ask
              }
              isWinner={
                teams[teamId].teamAnswers[position].markets[marketIndex]
                  ?.isWinner
              }
              trueValue={trueValue}
            />
          </FormControl>
        </Grid>
      );
    });
  };

  return (
    <Box>
      <Grid container columns={12} spacing={1} sx={{}}>
        {processTeams(selectedMarketIndex)}
      </Grid>
    </Box>
  );
};
export default AdminSessionTradeArea;
