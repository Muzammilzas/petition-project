import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { Plus, Share2, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Petition } from '../types';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchPetitions = async () => {
      try {
        const { data, error } = await supabase
          .from('petitions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPetitions(data || []);
      } catch (error) {
        console.error('Error fetching petitions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPetitions();
  }, [user, navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          My Petitions
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Plus />}
            onClick={() => navigate('/create-petition')}
          >
            Create New Petition
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              supabase.auth.signOut();
              navigate('/');
            }}
            sx={{ ml: 2 }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {petitions.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            You haven't created any petitions yet
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Plus />}
            onClick={() => navigate('/create-petition')}
            sx={{ mt: 2 }}
          >
            Create Your First Petition
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {petitions.map((petition) => (
            <Grid item xs={12} md={6} key={petition.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {petition.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {petition.story}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={2}>
                    <Users size={20} />
                    <Typography variant="body2" color="text.secondary" ml={1}>
                      {petition.signature_count} signatures
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<Share2 />}
                    onClick={() => navigate(`/share/${petition.id}`)}
                  >
                    Share Petition
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}