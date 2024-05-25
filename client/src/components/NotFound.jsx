import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LazyImage from './LazyImage';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: { xs: 2, md: 4 },
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '1200px',
        }}
      >
        <Box
          sx={{
            flex: 1,
            pr: { md: 8 },
            mb: { xs: 6, md: 0 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', md: 'flex-start' },
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              lineHeight: 1.2,
              background: 'linear-gradient(to right, #2196f3, #3f51b5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Face<span style={{ color: '#333' }}>Gram</span>
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              color: '#616161',
              lineHeight: 1.5,
              maxWidth: '500px',
              textAlign: 'justify',
            }}
          >
            Oops! Looks like the page you're looking for doesn't exist.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: { xs: 'center', md: 'flex-start' },
              mb: 3,
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/')}
              sx={{
                fontWeight: 'bold',
                backgroundColor: '#2196f3',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#0d47a1',
                },
              }}
            >
              Go to Home
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: { xs: 3, md: 0 },
          }}
        >
          <LazyImage
            src="/facegram.png"
            alt="FaceGram"
            aspectRatio="1:1"
            height="350px"
            width="350px"
            style={{
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default NotFoundPage;