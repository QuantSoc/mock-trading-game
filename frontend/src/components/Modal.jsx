import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({
  isModalShown,
  toggleModal,
  modalTitle,
  children,
  actions,
}) => {
  return ReactDOM.createPortal(
    <React.Fragment>
      <Dialog
        open={isModalShown}
        onClose={toggleModal}
        aria-labelledby="modal-dialog-title"
        aria-describedby="modal-dialog-description"
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle id="modal-dialog-title">
          <Typography sx={{ fontSize: 32 }}>{modalTitle}</Typography>
        </DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          {actions}
          <Button
            color="primary"
            variant="contained"
            onClick={toggleModal}
            margin="dense"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>,
    document.body
  );
};

export default Modal;
