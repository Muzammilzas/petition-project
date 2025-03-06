import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
} from '@mui/material';
import { FileSignature, Users, Share2 } from 'lucide-react';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../contexts/AuthContext';

export default function LandingPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCreatePetition = () => {
    if (user) {
      navigate('/create-petition');
    } else {
      setAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    navigate('/create-petition');
  };

  return (
    <>
      <Box
        sx={{
          background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Reform Timeshare Petition
        </Typography>
        <Typography variant="h5" paragraph>
          Timeshare scams trap millions—ePSF is fighting back.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={handleCreatePetition}
          sx={{ mt: 2 }}
        >
          Create a Petition
        </Button>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, height: '100%', textAlign: 'center' }}>
              <FileSignature size={48} style={{ marginBottom: '1rem' }} />
              <Typography variant="h5" gutterBottom>
                Create Your Petition
              </Typography>
              <Typography color="text.secondary">
                Share your story and set a goal for signatures to make real change happen.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, height: '100%', textAlign: 'center' }}>
              <Share2 size={48} style={{ marginBottom: '1rem' }} />
              <Typography variant="h5" gutterBottom>
                Share Your Voice
              </Typography>
              <Typography color="text.secondary">
                Spread the word through social media and email to gather support.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, height: '100%', textAlign: 'center' }}>
              <Users size={48} style={{ marginBottom: '1rem' }} />
              <Typography variant="h5" gutterBottom>
                Make an Impact
              </Typography>
              <Typography color="text.secondary">
                Together, we can reform the timeshare industry and protect consumers.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Ready to Make a Change?
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleCreatePetition}
            sx={{ mt: 2 }}
          >
            Start Your Petition Now
          </Button>
        </Box>
      </Container>

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}