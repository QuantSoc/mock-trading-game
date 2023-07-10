import { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  SvgIcon,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { fetchAPIRequest } from '../helpers';
import { ReactComponent as QuantsocIcon } from '../assets/quantsoc.svg';

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    fetchAPIRequest('/logout', 'POST', {}).then(() => {
      localStorage.removeItem('token');
      navigate('/');
    });
  };
  return (
    // NavBar below has styling and base structure from the MUI page
    // at https://mui.com/material-ui/react-app-bar/
    <AppBar position="fixed" sx={{ background: '#8763cb' }}>
      <Container maxWidth="100%">
        <Toolbar disableGutters>
          <SvgIcon
            sx={{
              width: 45,
              height: 45,
              display: { xs: 'none', md: 'flex' },
              marginRight: '10px',
            }}
          >
            <QuantsocIcon />
          </SvgIcon>
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 3,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Poppins',
              fontWeight: 700,
              letterSpacing: '.1rem',
              fontSize: 30,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            comps
          </Typography>
          {localStorage.getItem('token') && (
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>

              {/* HERE --> NavBar SHRUNK Menu Items */}
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate('/');
                  }}
                >
                  <Typography textAlign="center">Dashboard</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate('game-history');
                  }}
                >
                  <Typography textAlign="center">Game History</Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
          {!localStorage.getItem('token') && (
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>

              {/* HERE --> NavBar SHRUNK Menu Items */}
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate('/login');
                  }}
                >
                  <Typography textAlign="center">Login</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate('/register');
                  }}
                >
                  <Typography textAlign="center">Register</Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
          {/* HERE -->  NavBar EXPANDED Buttons */}
          <SvgIcon
            sx={{
              width: 40,
              height: 40,
              display: { xs: 'flex', md: 'none' },
              marginRight: '10px',
            }}
          >
            <QuantsocIcon />
          </SvgIcon>
          <Typography
            variant="h5"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'Poppins',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            comps
          </Typography>
          {!localStorage.getItem('token') && (
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Button
                onClick={() => {
                  handleCloseNavMenu();
                  navigate('/login');
                }}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Login
              </Button>
              <Button
                onClick={() => {
                  handleCloseNavMenu();
                  navigate('/register');
                }}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Register
              </Button>
            </Box>
          )}
          {localStorage.getItem('token') && (
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Button
                onClick={() => {
                  handleCloseNavMenu();
                  navigate('/');
                }}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Dashboard
              </Button>
              <Button
                onClick={() => {
                  handleCloseNavMenu();
                  navigate('/game-history');
                }}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Game History
              </Button>
            </Box>
          )}

          {/* HERE --> NavBar User Menu */}
          {localStorage.getItem('token') && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    navigate('/profile');
                  }}
                >
                  <Typography textAlign="center">Profile</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    navigate('/account');
                  }}
                >
                  <Typography textAlign="center">Account</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    navigate('/');
                  }}
                >
                  <Typography textAlign="center">Dashboard</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    handleLogout();
                  }}
                >
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
