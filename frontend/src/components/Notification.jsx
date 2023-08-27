import React from 'react';
import { Alert, AlertTitle, Snackbar } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const Notification = ({ type, message, open, setClose }) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={open}
      autoHideDuration={3000}
      onClose={() => setClose()}
      sx={{ mt: 5 }}
    >
      <Alert
        severity={type}
        sx={{
          maxWidth: 400,
          border: '0.5px solid #00000020',
          whiteSpace: 'pre-line',
        }}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              setClose();
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        <AlertTitle>
          {type?.charAt(0)?.toUpperCase() + type?.slice(1)}
        </AlertTitle>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
