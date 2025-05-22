import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Stepper,
    Step,
    StepLabel,
    Box,
    Button,
    Snackbar,
    Alert,
    Stack,
} from '@mui/material';
import {
    AppBar,
    Toolbar,
} from '@mui/material';
import {
    Add,
    Edit,
    Visibility,
    Download,
    Share,
    Logout,
} from '@mui/icons-material';
import StepForm from '../components/StepForm';
import Preview from '../components/Preview';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Dialog } from '@mui/material';
import AppHeader from '../components/AppHeader';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useTemplate } from '../context/TemplateContext';
import { Backdrop, CircularProgress } from '@mui/material';
import { getCVById, createCV, updateCV, downloadCV, generateShareLink } from '../services/cvService';
import { createPaymentOrder } from '../services/paymentService';
import { validateStepData } from '../components/StepForm';
import { markCVAsPaid } from '../services/cvService';
const steps = [
    'Basic Details',
    'Education',
    'Experience',
    'Projects',
    'Skills',
    'Social Profiles',
];

const initialData = {
    basicDetails: {
        image: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        intro: '',
    },
    education: [{ degree: '', institution: '', percentage: '', year: '' }],
    experience: [
        {
            organization: '',
            location: '',
            position: '',
            ctc: '',
            joiningDate: '',
            leavingDate: '',
            technologies: '',
        },
    ],
    projects: [
        { title: '', teamSize: '', duration: '', technologies: '', description: '' },
    ],
    skills: [{ name: '', proficiency: 0 }],
    socialProfiles: [{ platform: '', link: '' }],
};

const Editor = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState(initialData);
    const [isDirty, setIsDirty] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });
    const navigate = useNavigate();
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const { id } = useParams();
    const location = useLocation();
    const [showSharePrompt, setShowSharePrompt] = useState(false);
    const { selectedTemplate } = useTemplate();
    const [loading, setLoading] = useState(false);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const [isPaid, setIsPaid] = useState(false);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => setRazorpayLoaded(true);
        document.body.appendChild(script);
    }, []);

    useEffect(() => {
        const fetchCV = async () => {
            if (!id) return;

            try {
                const cvData = await getCVById(id);
                setFormData(cvData);
                setIsPaid(cvData.paid);
                setIsDirty(false);
            } catch (error) {
                console.error('Error loading CV:', error);
                openSnackbar('Failed to load CV for editing.', 'error');
            }
        };

        fetchCV();
    }, [id]);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    const updateFormData = (section, value) => {
        setFormData((prev) => ({ ...prev, [section]: value }));
        setIsDirty(true);
    };

    const openSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleSave = async () => {
        // const isValid = validateStepData(activeStep, formData);
        // if (!isValid) {
        //     openSnackbar("Please complete the current section correctly before saving.", "error");
        //     return;
        // }

        try {
            if (id) {
                await updateCV(id, formData);
                openSnackbar('CV updated successfully!', 'success');
            } else {
                const created = await createCV(formData);
                navigate(`/editor/${created._id}`);
                openSnackbar('CV saved successfully!', 'success');
            }
            setIsDirty(false);
        } catch (error) {
            console.error('Error saving CV:', error);
            openSnackbar('Failed to save CV. Please try again.', 'error');
        }
    };


    const handleOpenDownloadDialog = () => {
        setOpenConfirmDialog(true);
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleRazorpayPayment = async (actionType) => {
        if (isPaid) {
            if (actionType === 'download') {
                await handleDownload();
            } else if (actionType === 'share') {
                setShowSharePrompt(true);
            }
            return;
        }
        const isScriptLoaded = await loadRazorpayScript();

        if (!isScriptLoaded) {
            openSnackbar('Razorpay SDK failed to load. Please refresh and try again.', 'error');
            return;
        }

        try {
            const orderRes = await createPaymentOrder(100);
            const { amount, id: order_id, currency } = orderRes;

            const options = {
                key: 'rzp_test_SWktQT4QCgyM7C',
                amount,
                currency,
                name: 'CV Builder',
                description: 'Payment for CV Download/Share',
                order_id,
                handler: async function (response) {
                    if (response.razorpay_payment_id) {
                        try {
                            await markCVAsPaid(id);
                            setIsPaid(true);
                            openSnackbar('Payment successful!', 'success');

                            if (actionType === 'download') {
                                await handleDownload();
                            } else if (actionType === 'share') {
                                setShowSharePrompt(true);
                            }
                        } catch (err) {
                            console.error('Error marking payment as done:', err);
                            openSnackbar('Payment succeeded but marking as paid failed.', 'warning');
                        }
                    } else {
                        console.warn('No payment ID received');
                    }

                },

                prefill: {
                    name: formData.basicDetails.name,
                    email: formData.basicDetails.email,
                    contact: formData.basicDetails.phone,
                },
                theme: {
                    color: '#1976d2',
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (err) {
            console.error('Payment Error:', err);
            openSnackbar('Failed to initiate payment.', 'error');
        }
    };




    const handleDownload = async () => {
        setLoading(true);
        try {
            const templateMap = {
                layout1: '1',
                layout2: '2',
                layout3: '3',
            };

            const template = templateMap[selectedTemplate] || '1';
            const data = await downloadCV(id, template);

            const blob = new Blob([data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `cv-${selectedTemplate}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);

            openSnackbar('Download started!', 'success');
            setIsDirty(false);
        } catch (error) {
            console.error('Backend PDF generation failed:', error);
            openSnackbar('Failed to generate PDF. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };


    const handleShare = async () => {
        try {
            const { shareUrl } = await generateShareLink(id);

            if (navigator.share) {
                await navigator.share({
                    title: 'Check out my CV!',
                    text: 'Here is my professional CV created with CV Builder.',
                    url: shareUrl,
                });
            } else {
                await navigator.clipboard.writeText(shareUrl);
                openSnackbar('Share link copied to clipboard!', 'success');
            }

            setIsDirty(false);
        } catch (error) {
            console.error('Error generating share link:', error);
            openSnackbar('Failed to generate share link.', 'error');
        }
    };


    return (

        <>

            <Container maxWidth="lg" sx={{ mt: 5, mb: 8 }}>
                <Typography variant="h3" fontWeight="700" gutterBottom sx={{ mb: 4 }}>
                    CV Editor
                </Typography>

                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel
                                sx={{
                                    '& .MuiStepLabel-label': {
                                        typography: 'subtitle1',
                                        fontWeight: '600',
                                    },
                                }}
                            >
                                {label}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Box
                    sx={{
                        display: 'flex',
                        gap: 4,
                        alignItems: 'stretch',
                        flexWrap: 'nowrap',
                        flexDirection: { xs: 'column', md: 'row' },
                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            maxWidth: { xs: '100%', md: '50%' },
                            bgcolor: 'background.paper',
                            p: 3,
                            borderRadius: 2,
                            boxShadow: 3,
                            minWidth: 320,
                            height: '100%'
                        }}
                    >
                        <StepForm step={activeStep} data={formData} updateFormData={updateFormData} />

                        <Stack direction="row" justifyContent="space-between" spacing={2} sx={{ mt: 3 }}>
                            <Button
                                variant="outlined"
                                color="primary"
                                disabled={activeStep === 0}
                                onClick={() => setActiveStep((prev) => prev - 1)}
                            >
                                Back
                            </Button>

                            {activeStep === steps.length - 1 ? (
                                <Button variant="contained" color="success" onClick={handleSave}>
                                    Save CV
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        // const isValid = validateStepData(activeStep, formData);
                                        // if (!isValid) {
                                        //     openSnackbar("Please fill all required fields correctly.", "error");
                                        //     return;
                                        // }
                                        setActiveStep((prev) => prev + 1);
                                    }}
                                >
                                    Next
                                </Button>

                            )}
                        </Stack>




                        <Stack direction="row" spacing={2} sx={{ mt: 4, justifyContent: 'center' }}>
                            <Button onClick={() => {
                                handleRazorpayPayment("download")
                            }}>
                                Download
                            </Button>
                            <Button
                                onClick={() => {
                                    handleRazorpayPayment("share");
                                }}
                            >
                                Share
                            </Button>

                            {showSharePrompt && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        handleShare();
                                        setShowSharePrompt(false);
                                    }}
                                    style={{ marginTop: "1rem" }}
                                >
                                    Click here to Share your CV
                                </Button>
                            )}
                        </Stack>
                    </Box>

                    <Box
                        id="preview-container"
                        sx={{
                            overflow: 'visible',
                            minHeight: 'auto',
                            maxHeight: 'none',
                            wordBreak: 'break-word',
                            flex: 1,
                            maxWidth: { xs: '100%', md: '50%' },
                            border: '1px solid #ddd',
                            p: 3,
                            height: '100%',
                            borderRadius: 2,
                            bgcolor: '#f9f9f9',
                            boxShadow: 1,
                            minWidth: 320,
                        }}
                    >

                        <Preview data={formData} layout={selectedTemplate} />
                    </Box>
                </Box>


                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert
                        onClose={handleSnackbarClose}
                        severity={snackbar.severity}
                        sx={{ width: '100%' }}
                        variant="filled"
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
            <Dialog
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
            >
                <Box sx={{ p: 3, minWidth: 300 }}>
                    <Typography variant="h6" gutterBottom>
                        Confirm Download
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Payment is required before download. Do you want to proceed?
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button variant="outlined" onClick={() => setOpenConfirmDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => {
                                setOpenConfirmDialog(false);
                                handleDownload();
                            }}
                        >
                            Proceed
                        </Button>
                    </Box>
                </Box>
            </Dialog>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

        </>

    );
};

export default Editor;
