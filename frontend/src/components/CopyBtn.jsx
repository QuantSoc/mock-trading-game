import React, { useState } from 'react';
import { Button, Snackbar } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const CopyButton = ({ copyTitle, copyContent, styling, isContained }) => {
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const handleClick = () => {
    setIsButtonClicked(true);
    navigator.clipboard.writeText(copyContent);
  };

  return (
    <>
      <Button
        startIcon={<ContentCopyIcon />}
        sx={styling}
        color="primary"
        onClick={handleClick}
        variant={isContained ? 'contained' : 'text'}
      >
        {copyTitle}
      </Button>
      <Snackbar
        open={isButtonClicked}
        onClose={() => setIsButtonClicked(false)}
        autoHideDuration={2000}
        message="Copied to clipboard"
      />
    </>
  );
};

export default CopyButton;
