import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Preview from '../components/Preview';
import { Container, Typography, Button } from '@mui/material';
import axios from 'axios';
import AppHeader from '../components/AppHeader';
import { getCVById } from '../services/cvService';

const PreviewPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [cvData, setCvData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCV = async () => {
            try {
                const cvData = await getCVById(id);
                setCvData(cvData);
            } catch (err) {
                setError('Failed to load CV data.');
            } finally {
                setLoading(false);
            }
        };

        fetchCV();
    }, [id]);

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <>
            <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>

                <Typography variant="h4" sx={{ mb: 3 }}>
                    CV Preview
                </Typography>

                <Preview data={cvData} />
            </Container>
        </>

    );
};

export default PreviewPage;
