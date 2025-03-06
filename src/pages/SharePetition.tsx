import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Grid,
  IconButton,
  Snackbar,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Users,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Petition } from '../types';

export default function SharePetition() {
  const { id } = useParams<{ id: string }>();
  const [petition, setPetition] = useState<Petition | null>(null);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });

  useEffect(() => {
    const fetchPetition = async () => {
      try {
        const { data, error } = await supabase
          .from('petitions')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setPetition(data);
      } catch (error) {
        console.error('Error fetching petition:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPetition();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('signatures').insert([
        {
          petition_id: id,
          ...formData,
        },
      ]);

      if (error) throw error;

      // Clear form
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
      });

      // Refresh petition data to get updated signature count
      const { data: updatedPetition } = await supabase
        .from('petitions')
        .select('*')
        .eq('id', id)
        .single();

      if (updatedPetition) {
        setPetition(updatedPetition);
      }
    } catch (error) {
      console.error('Error signing petition:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Support our petition: ${petition?.title}`;

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setSnackbarOpen(true);
  };

  if (loading && !petition) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!petition) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" align="center">
          Petition not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {petition.title}
        </Typography>

        <Box display="flex" alignItems="center" mb={3}>
          <Users size={24} />
          <Typography variant="h6" color="primary" sx={{ ml: 1 }}>
            {petition.signature_count} signatures
          </Typography>
        </Box>

        <Typography variant="body1" paragraph>
          {petition.story}
        </Typography>

        <Box sx={{ my: 4 }}>
          <Typography variant="h6" gutterBottom>
            Share this petition
          </Typography>
          <Grid container spacing={2}>
            <Grid item>
              <IconButton
                color="primary"
                onClick={() => handleShare('facebook')}
                sx={{ bgcolor: 'action.hover' }}
              >
                <Facebook />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton
                color="primary"
                onClick={() => handleShare('twitter')}
                sx={{ bgcolor: 'action.hover' }}
              >
                <Twitter />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton
                color="primary"
                onClick={() => handleShare('linkedin')}
                sx={{ bgcolor: 'action.hover' }}
              >
                <Linkedin />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton
                color="primary"
                onClick={handleCopyLink}
                sx={{ bgcolor: 'action.hover' }}
              >
                <Copy />
              </IconButton>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 4 }} />
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Link copied to clipboard"
      />
    </Container>
  );
}