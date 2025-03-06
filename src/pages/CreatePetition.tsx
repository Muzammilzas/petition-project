import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material';
import { FileText, DollarSign } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function CreatePetition() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    story: '',
    assessed_value: '',
  });

  React.useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate form data
      if (!formData.title.trim() || !formData.story.trim() || !formData.assessed_value) {
        throw new Error('Please fill in all fields');
      }

      const numericValue = parseFloat(formData.assessed_value);
      if (isNaN(numericValue) || numericValue <= 0) {
        throw new Error('Please enter a valid assessed value');
      }

      // Create petition
      const { data, error: supabaseError } = await supabase
        .from('petitions')
        .insert([
          {
            user_id: user!.id,
            title: formData.title.trim(),
            story: formData.story.trim(),
            assessed_value: numericValue,
          },
        ])
        .select()
        .single();

      if (supabaseError) throw supabaseError;
      if (!data) throw new Error('Failed to create petition');

      // Navigate to share page
      navigate(`/share/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create Timeshare Petition
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Petition Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FileText size={20} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Tell Your Story"
            name="story"
            value={formData.story}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={6}
            helperText="Share your experience and why this petition matters"
          />

          <TextField
            fullWidth
            label="Timeshare Assessed Value"
            name="assessed_value"
            value={formData.assessed_value}
            onChange={handleChange}
            margin="normal"
            type="number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DollarSign size={20} />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/dashboard')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ flex: 1 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Create Petition'
              )}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}