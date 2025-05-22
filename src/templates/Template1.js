import { Box, Button, Typography } from '@mui/material';

const Template1 = ({ data }) => {
  return (
    <Box>
      <Typography variant="h4">{data.basicDetails?.name}</Typography>
    </Box>
  );
};

export default Template1;
