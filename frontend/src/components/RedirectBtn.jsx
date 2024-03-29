import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';

const RedirectBtn = ({
  destination,
  btnText,
  variant,
  color,
  isStartIcon,
  icon,
  disabled = false,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(destination);
  };

  return (
    <Box>
      <Button
        variant={variant}
        color={color}
        startIcon={isStartIcon && icon}
        endIcon={!isStartIcon && icon}
        onClick={handleClick}
        disabled={disabled}
      >
        {btnText}
      </Button>
    </Box>
  );
};
export default RedirectBtn;
