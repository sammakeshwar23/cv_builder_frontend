import React from 'react';
import {
  TextField,
  Box,
  Button,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

export const validateStepData = (step, data) => {
  switch (step) {
    case 0: {
      const { name, email, phone, address, city, state, pincode } = data.basicDetails;
      if (!name || !email || !phone || !address || !city || !state || !pincode) return false;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[6-9]\d{9}$/;
      const pincodeRegex = /^\d{6}$/;
      return (
        emailRegex.test(email) &&
        phoneRegex.test(phone) &&
        pincodeRegex.test(pincode)
      );
    }
    case 1:
      return data.education.every((edu) =>
        edu.degree && edu.institution && edu.percentage && edu.year
      );
    case 2:
      return data.experience.every((exp) =>
        exp.organization && exp.position && exp.joiningDate
      );
    case 3:
      return data.projects.every((proj) =>
        proj.title && proj.technologies
      );
    case 4:
      return data.skills.length > 0;
    case 5:
      return data.socialProfiles.every((sp) =>
        sp.platform && sp.link
      );
    default:
      return false;
  }
};


const StepForm = ({ step, data, updateFormData }) => {

  const handleChange = (section, index, field, value) => {
    if (typeof index === 'number') {
      const updatedArray = [...data[section]];
      updatedArray[index] = { ...updatedArray[index], [field]: value };
      updateFormData(section, updatedArray);
    } else {
      updateFormData(section, { ...data[section], [field]: value });
    }
  };

  const handleAdd = (section, emptyEntry) => {
    updateFormData(section, [...data[section], emptyEntry]);
  };

  const handleDelete = (section, index) => {
    const updatedArray = data[section].filter((_, i) => i !== index);
    updateFormData(section, updatedArray);
  };

  switch (step) {
    case 0:
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Name"
            value={data.basicDetails.name}
            onChange={(e) => handleChange('basicDetails', null, 'name', e.target.value)}
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            value={data.basicDetails.email}
            onChange={(e) => handleChange('basicDetails', null, 'email', e.target.value)}
            fullWidth
          />
          <TextField
            label="Phone"
            value={data.basicDetails.phone}
            onChange={(e) => handleChange('basicDetails', null, 'phone', e.target.value)}
            fullWidth
          />
          <TextField
            label="Address"
            value={data.basicDetails.address}
            onChange={(e) => handleChange('basicDetails', null, 'address', e.target.value)}
            fullWidth
          />
          <TextField
            label="City"
            value={data.basicDetails.city}
            onChange={(e) => handleChange('basicDetails', null, 'city', e.target.value)}
            fullWidth
          />
          <TextField
            label="State"
            value={data.basicDetails.state}
            onChange={(e) => handleChange('basicDetails', null, 'state', e.target.value)}
            fullWidth
          />
          <TextField
            label="Pincode"
            value={data.basicDetails.pincode}
            onChange={(e) => handleChange('basicDetails', null, 'pincode', e.target.value)}
            fullWidth
          />
          <TextField
            label="Introductory Paragraph"
            multiline
            rows={4}
            value={data.basicDetails.intro}
            onChange={(e) => handleChange('basicDetails', null, 'intro', e.target.value)}
            fullWidth
          />
        </Box>
      );

    case 1:
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {data.education.map((edu, idx) => (
            <Box
              key={idx}
              sx={{
                border: '1px solid #ccc',
                p: 2,
                borderRadius: 1,
                position: 'relative',
                backgroundColor: '#fff',
              }}
            >
              <Typography variant="subtitle1" mb={1}>
                Education {idx + 1}
              </Typography>
              <TextField
                label="Degree"
                value={edu.degree}
                onChange={(e) => handleChange('education', idx, 'degree', e.target.value)}
                fullWidth
                sx={{ mb: 1 }}
              />
              <TextField
                label="Institution"
                value={edu.institution}
                onChange={(e) => handleChange('education', idx, 'institution', e.target.value)}
                fullWidth
                sx={{ mb: 1 }}
              />
              <TextField
                label="Percentage"
                value={edu.percentage}
                onChange={(e) => handleChange('education', idx, 'percentage', e.target.value)}
                fullWidth
                sx={{ mb: 1 }}
              />
              <TextField
                label="Year"
                value={edu.year}
                onChange={(e) => handleChange('education', idx, 'year', e.target.value)}
                fullWidth
              />
              {data.education.length > 1 && (
                <IconButton
                  onClick={() => handleDelete('education', idx)}
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                  color="error"
                >
                  <Delete />
                </IconButton>
              )}
            </Box>
          ))}
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() =>
              handleAdd('education', { degree: '', institution: '', percentage: '', year: '' })
            }
          >
            Add Education
          </Button>
        </Box>
      );

    case 2:
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {data.experience.map((exp, idx) => (
            <Box
              key={idx}
              sx={{
                border: '1px solid #ccc',
                p: 2,
                borderRadius: 1,
                position: 'relative',
                backgroundColor: '#fff',
              }}
            >
              <Typography variant="subtitle1" mb={1}>
                Experience {idx + 1}
              </Typography>
              <TextField
                label="Organization"
                value={exp.organization}
                onChange={(e) => handleChange('experience', idx, 'organization', e.target.value)}
                fullWidth
                sx={{ mb: 1 }}
              />
              <TextField
                label="Location"
                value={exp.location}
                onChange={(e) => handleChange('experience', idx, 'location', e.target.value)}
                fullWidth
                sx={{ mb: 1 }}
              />
              <TextField
                label="Position"
                value={exp.position}
                onChange={(e) => handleChange('experience', idx, 'position', e.target.value)}
                fullWidth
                sx={{ mb: 1 }}
              />
              <TextField
                label="CTC"
                value={exp.ctc}
                onChange={(e) => handleChange('experience', idx, 'ctc', e.target.value)}
                fullWidth
                sx={{ mb: 1 }}
              />
              <TextField
                label="Joining Date"
                type="date"
                value={exp.joiningDate}
                onChange={(e) => handleChange('experience', idx, 'joiningDate', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 1 }}
              />
              <TextField
                label="Leaving Date"
                type="date"
                value={exp.leavingDate}
                onChange={(e) => handleChange('experience', idx, 'leavingDate', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 1 }}
              />
              <TextField
                label="Technologies"
                value={exp.technologies}
                onChange={(e) => handleChange('experience', idx, 'technologies', e.target.value)}
                fullWidth
              />
              {data.experience.length > 1 && (
                <IconButton
                  onClick={() => handleDelete('experience', idx)}
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                  color="error"
                >
                  <Delete />
                </IconButton>
              )}
            </Box>
          ))}
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() =>
              handleAdd('experience', {
                organization: '',
                location: '',
                position: '',
                ctc: '',
                joiningDate: '',
                leavingDate: '',
                technologies: '',
              })
            }
          >
            Add Experience
          </Button>
        </Box>
      );

    case 3:
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {data.projects.map((proj, idx) => (
            <Box
              key={idx}
              sx={{
                border: '1px solid #ccc',
                p: 2,
                borderRadius: 1,
                position: 'relative',
                backgroundColor: '#fff',
              }}
            >
              <Typography variant="subtitle1" mb={1}>
                Project {idx + 1}
              </Typography>
              <TextField
                label="Title"
                value={proj.title}
                onChange={(e) => handleChange('projects', idx, 'title', e.target.value)}
                fullWidth
                sx={{ mb: 1 }}
              />
              <TextField
                label="Team Size"
                value={proj.teamSize}
                onChange={(e) => handleChange('projects', idx, 'teamSize', e.target.value)}
                fullWidth
                sx={{ mb: 1 }}
              />
              <TextField
                label="Duration"
                value={proj.duration}
                onChange={(e) => handleChange('projects', idx, 'duration', e.target.value)}
                fullWidth
                sx={{ mb: 1 }}
              />
              <TextField
                label="Technologies"
                value={proj.technologies}
                onChange={(e) => handleChange('projects', idx, 'technologies', e.target.value)}
                fullWidth
                sx={{ mb: 1 }}
              />
              <TextField
                label="Description"
                multiline
                rows={3}
                value={proj.description}
                onChange={(e) => handleChange('projects', idx, 'description', e.target.value)}
                fullWidth
              />
              {data.projects.length > 1 && (
                <IconButton
                  onClick={() => handleDelete('projects', idx)}
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                  color="error"
                >
                  <Delete />
                </IconButton>
              )}
            </Box>
          ))}
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() =>
              handleAdd('projects', {
                title: '',
                teamSize: '',
                duration: '',
                technologies: '',
                description: '',
              })
            }
          >
            Add Project
          </Button>
        </Box>
      );

    case 4:
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {data.skills.map((skill, idx) => (
            <Box
              key={idx}
              sx={{
                border: '1px solid #ccc',
                p: 2,
                borderRadius: 1,
                position: 'relative',
                backgroundColor: '#fff',
                display: 'flex',
                gap: 2,
                alignItems: 'center',
              }}
            >
              <TextField
                label="Skill Name"
                value={skill.name}
                onChange={(e) => handleChange('skills', idx, 'name', e.target.value)}
                sx={{ flex: 2 }}
              />
              <TextField
                label="Proficiency (%)"
                type="number"
                inputProps={{ min: 0, max: 100 }}
                value={skill.proficiency}
                onChange={(e) =>
                  handleChange('skills', idx, 'proficiency', Number(e.target.value))
                }
                sx={{ flex: 1 }}
              />
              {data.skills.length > 1 && (
                <IconButton
                  onClick={() => handleDelete('skills', idx)}
                  color="error"
                >
                  <Delete />
                </IconButton>
              )}
            </Box>
          ))}
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => handleAdd('skills', { name: '', proficiency: 0 })}
          >
            Add Skill
          </Button>
        </Box>
      );

    case 5:
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {data.socialProfiles.map((profile, idx) => (
            <Box
              key={idx}
              sx={{
                border: '1px solid #ccc',
                p: 2,
                borderRadius: 1,
                position: 'relative',
                backgroundColor: '#fff',
                display: 'flex',
                gap: 2,
                alignItems: 'center',
              }}
            >
              <TextField
                label="Platform"
                value={profile.platform}
                onChange={(e) => handleChange('socialProfiles', idx, 'platform', e.target.value)}
                sx={{ flex: 2 }}
              />
              <TextField
                label="Profile Link"
                value={profile.link}
                onChange={(e) => handleChange('socialProfiles', idx, 'link', e.target.value)}
                sx={{ flex: 3 }}
              />
              {data.socialProfiles.length > 1 && (
                <IconButton
                  onClick={() => handleDelete('socialProfiles', idx)}
                  color="error"
                >
                  <Delete />
                </IconButton>
              )}
            </Box>
          ))}
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => handleAdd('socialProfiles', { platform: '', link: '' })}
          >
            Add Profile
          </Button>
        </Box>
      );

    default:
      return null;
  }
};

export default StepForm;
