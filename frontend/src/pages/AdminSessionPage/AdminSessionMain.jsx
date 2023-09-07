import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Divider,
  Skeleton,
  LinearProgress,
  FormControl,
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useEffect, useState, useContext } from 'react';
import { fetchAPIRequest } from '../../helpers';
import { useParams } from 'react-router-dom';
import AdvanceGameBtn from '../../components/AdvanceGameBtn';
import TeamStats from '../GameHistoryPage/TeamStats';
import { AlertContext } from '../../contexts/NotificationContext';
import { EditGameSection } from '../EditGamePage';

const AdminSessionMain = ({
  gameId,
  position,
  questions,
  isSessionStart,
  setIsSessionStart,
}) => {
  const [hasTraded, setHasTraded] = useState(false);

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        mb: 5,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          fontSize: { xs: 24, md: 34 },
        }}
      >
        <AdminPanelSettingsIcon sx={{ width: 50, height: 50 }} />
        Session Controls
      </Typography>
      {isSessionStart && (
        <AdvanceGameBtn
          gameId={gameId}
          isSessionStart={isSessionStart}
          setIsSessionStart={setIsSessionStart}
          isEnd={position === questions.length - 1}
          unsetTradeBtn={() => setHasTraded(false)}
        />
      )}
    </Box>
  );
};
export default AdminSessionMain;
