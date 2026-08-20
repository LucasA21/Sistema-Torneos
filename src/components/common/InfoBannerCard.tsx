'use client';

// src/components/common/InfoBannerCard.tsx
// Tarjeta promocional compacta y elegante para guiar al usuario hacia la sección Información.

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalculateIcon from '@mui/icons-material/Calculate';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

export default function InfoBannerCard() {
  return (
    <Paper
      variant="outlined"
      sx={(theme) => ({
        p: { xs: 2.5, sm: 3 },
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)'
            : 'linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 100%)',
        borderColor:
          theme.palette.mode === 'dark'
            ? 'rgba(96, 165, 250, 0.25)'
            : 'rgba(37, 99, 235, 0.2)',
        boxShadow:
          theme.palette.mode === 'dark'
            ? '0 4px 20px rgba(0, 0, 0, 0.25)'
            : '0 4px 20px rgba(37, 99, 235, 0.08)',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        gap: 2,
      })}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
        <Box
          sx={(theme) => ({
            width: 52,
            height: 52,
            borderRadius: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor:
              theme.palette.mode === 'dark'
                ? 'rgba(37, 99, 235, 0.2)'
                : 'rgba(37, 99, 235, 0.1)',
            color: 'primary.main',
            border: '1px solid',
            borderColor:
              theme.palette.mode === 'dark'
                ? 'rgba(96, 165, 250, 0.3)'
                : 'rgba(37, 99, 235, 0.2)',
            flexShrink: 0,
          })}
        >
          <CalculateIcon sx={{ fontSize: 30 }} />
        </Box>

        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.05rem', lineHeight: 1.3 }}>
            ¿Cómo se calcula cada partido en la simulación?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Explorá nuestro gráfico explicativo interactivo paso a paso: ratings, localía, distribución de Poisson y azar de Monte Carlo.
          </Typography>
        </Box>
      </Box>

      <Button
        component={Link}
        href="/informacion"
        variant="contained"
        endIcon={<ArrowForwardIcon />}
        sx={{
          whiteSpace: 'nowrap',
          px: 3,
          py: 1.2,
          fontWeight: 700,
          borderRadius: 2.5,
          alignSelf: { xs: 'stretch', md: 'auto' },
        }}
      >
        Ver Explicación Paso a Paso
      </Button>
    </Paper>
  );
}
