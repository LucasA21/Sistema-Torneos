'use client';

// src/app/informacion/page.tsx
// Sección de Información y documentación interactiva del modelo de simulación de torneos.

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppLayout from '@/components/layout/AppLayout';
import SimulationCalculationGraphic from '@/components/simulation/SimulationCalculationGraphic';

export default function InformacionPage() {
  return (
    <AppLayout>
      <Box sx={{ maxWidth: 1200, mx: 'auto', pb: 4 }}>
        {/* Encabezado principal */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: 900, lineHeight: 1.2, color: 'text.primary' }}
            gutterBottom
          >
            ¿Cómo Funciona el{' '}
            <Box
              component="span"
              sx={(theme) => ({
                background:
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(90deg, #60A5FA 0%, #38BDF8 100%)'
                    : 'linear-gradient(90deg, #1D4ED8 0%, #2563EB 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              })}
            >
              Cálculo de Goles?
            </Box>
          </Typography>

          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '100%', width: '100%', lineHeight: 1.5 }}>
            El simulador traduce la habilidad real de cada equipo en probabilidades de gol combinando
            el factor localía, el rendimiento del día (ruido) y la distribución estadística de Poisson.
          </Typography>
        </Box>

        {/* SECCIÓN DEL GRÁFICO EXPLICATIVO INTERACTIVO DE 6 PASOS */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" sx={{ fontWeight: 900, mb: 2, color: 'text.primary' }}>
            📊 Diagrama de Cálculo Paso a Paso en Tiempo Real
          </Typography>
          <SimulationCalculationGraphic />
        </Box>
      </Box>
    </AppLayout>
  );
}
