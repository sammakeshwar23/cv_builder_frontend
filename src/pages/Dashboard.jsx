import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  CircularProgress,
  Box,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  useTheme
} from '@mui/material';
import {
  Add,
  Edit,
  Visibility,
  Download,
  Share
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AppHeader from '../components/AppHeader';
import { getUserAllCVs } from '../services/cvService';
import { downloadCV } from '../services/cvService';
import Sidebar from '../components/Sidebar';
import { deleteCV } from '../services/cvService';
import DeleteIcon from '@mui/icons-material/Delete';
import { Snackbar, Alert } from '@mui/material';

const Dashboard = () => {
  const theme = useTheme();
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentDialog, setPaymentDialog] = useState({
    open: false,
    cvId: null,
    action: ''
  });
  const navigate = useNavigate();
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    cvId: null,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        const data = await getUserAllCVs();
        console.log('Fetched CVs:', data);

        if (Array.isArray(data)) {
          setCvs(data);
        } else if (Array.isArray(data.cvs)) {
          setCvs(data.cvs);
        } else {
          console.error('Unexpected response structure:', data);
          setCvs([]);
        }
      } catch (error) {
        console.error('Failed to fetch CVs:', error);
        setCvs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCVs();
  }, []);

  const handlePreview = (cvId) => {
    navigate(`/preview/${cvId}`);
  };

  const handleEdit = (cvId) => {
    navigate(`/editor/${cvId}`);
  };

  const handleAddNew = () => {
    navigate('/editor');
  };

  const openPaymentDialog = (cvId, action) => {
    setPaymentDialog({ open: true, cvId, action });
  };

  const closePaymentDialog = () => {
    setPaymentDialog({ open: false, cvId: null, action: '' });
  };

  const handleDeleteClick = (cvId) => {
    setDeleteDialog({ open: true, cvId });
  };

  const handleDeleteConfirm = async () => {
    const cvId = deleteDialog.cvId;
    try {
      await deleteCV(cvId);
      setCvs((prev) => prev.filter((cv) => cv._id !== cvId));
      setSnackbar({ open: true, message: 'CV deleted successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error deleting CV:', error);
      setSnackbar({ open: true, message: 'Failed to delete CV. Please try again.', severity: 'error' });
    } finally {
      setDeleteDialog({ open: false, cvId: null });
    }
  };



  const handlePaymentConfirm = async () => {
    const { cvId, action } = paymentDialog;

    if (action === 'download') {
      try {
        const blobData = await downloadCV(cvId);

        const blob = new Blob([blobData], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `cv_${cvId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading CV:', error);
        alert('Failed to download CV. Please try again.');
      }
    } else if (action === 'share') {
      const shareUrl = `${window.location.origin}/preview/${cvId}`;
      navigator.clipboard.writeText(shareUrl);
      alert('Sharing link copied to clipboard!');
    }

    closePaymentDialog();
  };

  return (
    <>
      <Sidebar />

      <Box sx={{ ml: '240px', p: 3, minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
        <Container maxWidth="lg">


          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="60vh"
              sx={{ position: 'relative' }}
            >
              <CircularProgress size={60} color="primary" />
            </Box>
          ) : cvs.length === 0 ? (
            <Typography variant="body1" color="text.secondary" textAlign="center" mt={5}>
              You haven’t created any CVs yet. Click “Add New CV” to get started!
            </Typography>
          ) : (
            <Grid container spacing={4}>
              {cvs?.map((cv, index) => (
                <Grid item xs={12} sm={6} md={4} key={cv._id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: theme.shadows[4],
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        boxShadow: theme.shadows[10],
                        transform: 'translateY(-5px)',
                      }
                    }}
                    elevation={3}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight="600" gutterBottom>
                        {cv.title || `Resume ${index + 1}`}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Last Updated: {new Date(cv.updatedAt).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {cv.description || 'No description available.'}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
                      <Box>
                        <Tooltip title="Preview CV">
                          <IconButton
                            onClick={() => handlePreview(cv._id)}
                            color="primary"
                            size="large"
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit CV">
                          <IconButton
                            onClick={() => handleEdit(cv._id)}
                            color="secondary"
                            size="large"
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete CV">
                          <IconButton onClick={() => handleDeleteClick(cv._id)} color="error" size="large">
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>

                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          <Dialog open={paymentDialog.open} onClose={closePaymentDialog}>
            <DialogTitle>Payment Required</DialogTitle>
            <DialogContent>
              <Typography>
                {paymentDialog.action === 'download'
                  ? 'To download this CV as a PDF, you need to make a payment.'
                  : 'To share this CV on social media, you need to make a payment.'}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={closePaymentDialog}>Cancel</Button>
              <Button variant="contained" onClick={handlePaymentConfirm}>
                Proceed to Pay
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, cvId: null })}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <Typography>Are you sure you want to delete this CV?</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialog({ open: false, cvId: null })}>Cancel</Button>
              <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
                Delete
              </Button>
            </DialogActions>
          </Dialog>

        </Container>

        <Fab
          color="primary"
          aria-label="add"
          onClick={handleAddNew}
          sx={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            boxShadow: theme.shadows[6],
          }}
        >
          <Add />
        </Fab>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Dashboard;
