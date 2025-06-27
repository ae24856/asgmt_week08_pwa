import React from 'react';
import { Box, Typography, Link } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        mt: 4,
        backgroundColor: 'grey.200',
        textAlign: 'center',
      }}
    >
      <Typography variant="caption" >
        © 2025 ae24856. All rights reserved.
        <br />
        Made with ❤️ by {' '}
        <Link color="inherit" href="https://github.com/yudododo" target="_blank">
          Annie
        </Link>
      </Typography>
    </Box>
  );
}

export default Footer;