import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Stack,
  Snackbar,
  Alert,
  Divider,
  InputAdornment,
  IconButton,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { registerUser } from '../../services/authService';
import { GOOGLE_AUTH_URL } from '../../constants/api';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    contact: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    const { username, email, password } = formData;

    if (!username || !email || !password) {
      setSnackbar({ open: true, message: 'Please fill all mandatory fields.', severity: 'error' });
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setSnackbar({ open: true, message: 'Enter a valid email address.', severity: 'error' });
      return false;
    }

    if (password.length < 6) {
      setSnackbar({ open: true, message: 'Password must be at least 6 characters.', severity: 'error' });
      return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{6,}$/;
    if (!passwordRegex.test(password)) {
      setSnackbar({
        open: true,
        message: 'Password must include uppercase, lowercase, number, and special character.',
        severity: 'error',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await registerUser(formData);
      setSnackbar({ open: true, message: 'Registration successful! Redirecting...', severity: 'success' });
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Registration failed.',
        severity: 'error',
      });
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', height: '100vh' }}>
      <Card sx={{ width: '100%' }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Create a New Account
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Contact Number"
              name="contact"
              type="tel"
              value={formData.contact}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={toggleShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Stack spacing={2} mt={2}>
              <Button type="submit" fullWidth variant="contained" color="primary">
                Register
              </Button>
              <Divider>OR</Divider>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<GoogleIcon />}
                onClick={handleGoogleRegister}
              >
                Register with Google
              </Button>
              <Button
                fullWidth
                variant="text"
                color="secondary"
                onClick={() => navigate('/')}
              >
                Already have an account? Login
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Register;
