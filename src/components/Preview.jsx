import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useTemplate } from '../context/TemplateContext';
import { getCVPreview } from '../services/cvService';

const Preview = ({ data }) => {
  const { selectedTemplate, setSelectedTemplate } = useTemplate(1);
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    if (data && selectedTemplate) {
      const templateNumber = {
        layout1: 1,
        layout2: 2,
        layout3: 3,
      }[selectedTemplate] || 1;

      getCVPreview(templateNumber, data)
        .then(setHtmlContent)
        .catch(err => console.error('Failed to load template:', err));
    }
  }, [selectedTemplate, data]);

  if (!data) return <Typography>Loading CV preview...</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        {['layout1', 'layout2', 'layout3'].map((layoutKey, idx) => (
          <Button
            key={layoutKey}
            variant={selectedTemplate === layoutKey ? 'contained' : 'outlined'}
            onClick={() => setSelectedTemplate(layoutKey)}
            aria-pressed={selectedTemplate === layoutKey}
          >
            Template {idx + 1}
          </Button>
        ))}
      </Box>

      <Box
        sx={{ border: '1px solid #ccc', p: 2 }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </Box>
  );
};

export default Preview;
