import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const layouts = [
  {
    id: 'layout1',
    name: 'Classic Layout',
    description: 'A clean and simple layout with section headers.',
    imageUrl: '/images/layout1-preview.png', 
  },
  {
    id: 'layout2',
    name: 'Modern Layout',
    description: 'A sleek modern look with icons and sidebars.',
    imageUrl: '/images/layout2-preview.png',
  },
  {
    id: 'layout3',
    name: 'Creative Layout',
    description: 'Bold colors and creative styling for standout CVs.',
    imageUrl: '/images/layout3-preview.png',
  },
];

const Layouts = () => {
  const navigate = useNavigate();

  const handleSelectLayout = (layoutId) => {
    navigate('/editor', { state: { selectedLayout: layoutId } });
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Choose a Layout
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Preview and select a CV layout to start creating your resume.
      </Typography>

      <Grid container spacing={4}>
        {layouts.map((layout) => (
          <Grid item xs={12} sm={6} md={4} key={layout.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box
                component="img"
                src={layout.imageUrl}
                alt={`${layout.name} preview`}
                sx={{
                  width: '100%',
                  height: 200,
                  objectFit: 'cover',
                  borderRadius: 1,
                }}
              />
              <CardContent>
                <Typography variant="h6">{layout.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {layout.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ mt: 'auto', justifyContent: 'center' }}>
                <Button variant="contained" onClick={() => handleSelectLayout(layout.id)}>
                  Select
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Layouts;
