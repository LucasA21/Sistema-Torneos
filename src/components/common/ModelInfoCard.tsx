'use client';

// src/components/common/ModelInfoCard.tsx
// Tarjeta o Acordeón explicativo de los parámetros y modelo de simulación.

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const PARAMETERS = [
  {
    title: 'Rating de Habilidad',
    symbol: 'Rating (1-100)',
    description:
      'Indica la fuerza y potencial del equipo. A mayor rating, mayor probabilidad de generar situaciones de gol.',
  },
  {
    title: 'Ventaja de Localía',
    symbol: '+Bonus Local',
    description:
      'El equipo local recibe un incremento estocástico en su efectividad por jugar en su propio estadio.',
  },
  {
    title: 'Esperanza de Goles',
    symbol: 'λ (Lambda)',
    description:
      'Se calcula la diferencia neta de fuerza entre ambos equipos para proyectar el promedio esperado de goles de cada uno.',
  },
  {
    title: 'Distribución de Poisson',
    symbol: 'Modelo Aleatorio',
    description:
      'Los goles se generan aleatoriamente siguiendo una distribución de Poisson, permitiendo resultados realistas y empates.',
  },
];

export default function ModelInfoCard() {
  return (
    <Accordion
      variant="outlined"
      sx={{
        borderRadius: 2,
        '&:before': { display: 'none' },
        bgcolor: 'background.paper',
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <InfoOutlinedIcon color="primary" />
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1rem' }}
          >
            ¿Cómo funciona la simulación? (Parámetros y Modelo)
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          El motor utiliza un modelo probabilístico estocástico de expectativa de gol basado en la
          fuerza de los equipos y factores de competición:
        </Typography>

        <Grid container spacing={2}>
          {PARAMETERS.map((param) => (
            <Grid key={param.title} size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  height: '100%',
                  bgcolor: 'action.hover',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {param.title}
                  </Typography>
                  <Chip label={param.symbol} size="small" color="primary" variant="outlined" />
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', lineHeight: 1.4 }}
                >
                  {param.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 2.5, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">
            <strong>Reglas de Liga:</strong> 3 puntos por victoria, 1 por empate, 0 por derrota. Los
            desempates en la tabla se definen por Puntos, Diferencia de Goles (DG), Goles a Favor
            (GF) y Partido Directo.
          </Typography>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
