import { useEffect, useState } from 'react';

import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Tooltip,
  Switch,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';

const EditGameMarket = ({
  name,
  rounds,
  trueValue,
  selectedMarketIndex,
  setSelectedMarketIndex,
  markets,
  setMarkets,
  isDisabled,
}) => {
  const [marketName, setMarketName] = useState(name);
  const [marketTrueValue, setMarketTrueValue] = useState(0);
  const [isDefaultTrueValue, setIsDefaultTrueValue] = useState(
    trueValue !== -1
  );
  useEffect(() => {
    setMarketName(name);
  }, [name, markets]);
  useEffect(() => {
    setMarketTrueValue(trueValue);
    setIsDefaultTrueValue(trueValue !== -1);
  }, [trueValue]);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <TextField
          label="Market Name"
          sx={{ width: '100%' }}
          value={marketName}
          disabled={isDisabled}
          onChange={(event) => {
            setMarketName(event.target.value);
            markets[selectedMarketIndex].name = event.target.value;
            setMarkets([...markets]);
          }}
        />
        <TextField
          label="True Value"
          type="number"
          sx={{ minWidth: 25, ml: 2 }}
          value={trueValue}
          placeholder={`${marketTrueValue}`}
          disabled={isDisabled || !isDefaultTrueValue}
          onChange={(event) => {
            setMarketTrueValue(event.target.value);
            markets[selectedMarketIndex].trueValue = event.target.value;
            setMarkets([...markets]);
          }}
        />
        {!isDisabled && (
          <Tooltip title="Default True Value">
            <Switch
              checked={isDefaultTrueValue}
              disabled={isDisabled}
              onChange={() => {
                // if true, set the opposite as we want it off.
                markets[selectedMarketIndex].trueValue = isDefaultTrueValue
                  ? -1
                  : marketTrueValue;
                setIsDefaultTrueValue((prev) => !prev);
                setMarkets([...markets]);
              }}
            />
          </Tooltip>
        )}
        {!isDisabled && (
          <Tooltip title="Delete Market">
            <IconButton
              color="error"
              disabled={isDisabled}
              onClick={() => {
                setSelectedMarketIndex(0);
                setTimeout(() => {
                  markets.splice(selectedMarketIndex, 1);
                  setMarkets([...markets]);
                }, 300);
              }}
              sx={{ p: 2, ml: 2, opacity: 0.7 }}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      {rounds?.map((round, index) => {
        return (
          <Box key={'roundBox' + index} sx={{ py: 2, pl: 4 }}>
            <Typography key={'roundNum' + index}>Round {index + 1}</Typography>
            <Box key={'roundDesc' + index} sx={{ display: 'flex', pt: 1 }}>
              <TextField
                key={'roundDescTextbox' + index}
                label="Hint"
                fullWidth
                value={round?.hint}
                placeholder={round?.hint}
                disabled={isDisabled}
                onChange={(event) => {
                  markets.forEach(
                    (market) => (market.rounds[index].hint = event.target.value)
                  );
                  setMarkets([...markets]);
                }}
              />
              {!isDisabled && (
                <Tooltip
                  title={
                    <p>
                      Delete round from <b>all markets</b>
                    </p>
                  }
                >
                  <IconButton
                    color="error"
                    onClick={() => {
                      markets.forEach((market) =>
                        market.rounds.splice(index, 1)
                      );
                      setMarkets([...markets]);
                    }}
                    sx={{ p: 2, ml: 2, opacity: 0.7 }}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
        );
      })}
      <Button
        startIcon={<AddIcon />}
        sx={{ ml: 4, mt: 2 }}
        disabled={isDisabled}
        onClick={() => {
          // markets[selectedMarketIndex].rounds.push({ ...ROUND_PAYLOAD });
          markets.forEach((market) => {
            market.rounds.push({ hint: '' });
          });
          setMarkets([...markets]);
        }}
      >
        New Round
      </Button>
    </Box>
  );
};
export default EditGameMarket;
