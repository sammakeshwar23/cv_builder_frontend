import React, { useState } from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Drawer,
    IconButton,
    useMediaQuery,
    AppBar,
    Toolbar,
    Typography
} from '@mui/material';
import { Dashboard, AddCircle, Logout, Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const drawerWidth = 240;

const Sidebar = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const SidebarContent = (
        <Box
            sx={{
                width: drawerWidth,
                height: '100%',
                backgroundColor: '#2c3e50',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                pt: 2,
                pb: 2,
            }}
        >
            <List sx={{ flexGrow: 1 }}>
                <ListItem button onClick={() => navigate('/dashboard')}>
                    <ListItemIcon sx={{ color: '#fff' }}><Dashboard /></ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button onClick={() => navigate('/editor')}>
                    <ListItemIcon sx={{ color: '#fff' }}><AddCircle /></ListItemIcon>
                    <ListItemText primary="Create New CV" />
                </ListItem>
            </List>

            <Box>
                <Divider sx={{ backgroundColor: '#7f8c8d', mb: 1 }} />
                <List>
                    <ListItem button onClick={() => {
                        localStorage.removeItem('token');
                        navigate('/login');
                    }}>
                        <ListItemIcon sx={{ color: '#fff' }}><Logout /></ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItem>
                </List>
            </Box>
        </Box>
    );

    return (
        <>
            {isMobile && (
                <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap>
                            CV Builder
                        </Typography>
                    </Toolbar>
                </AppBar>
            )}

            {isMobile ? (
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                        },
                    }}
                >
                    {SidebarContent}
                </Drawer>
            ) : (
                <Drawer
                    variant="permanent"
                    open
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            position: 'fixed',
                            backgroundColor: '#2c3e50',
                            color: '#fff',
                        },
                    }}
                >
                    {SidebarContent}
                </Drawer>
            )}
        </>
    );
};

export default Sidebar;
