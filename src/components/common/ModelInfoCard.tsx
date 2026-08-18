'use client';

// src/components/common/ModelInfoCard.tsx
// Tarjeta interactiva y desplegable que explica la simulación en palabras sencillas.

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

interface ParameterInfo {
  id: string;
  title: string;
  badge: string;
  shortDesc: string;
  simpleExplanation: string[];
}

const PARAMETERS: ParameterInfo[] = [
  {
    id: 'rating',
    title: 'Rating de Habilidad',
    badge: 'Nivel (1 a 100)',
    shortDesc: 'Refleja la calidad general del equipo según su plantel y rendimiento.',
    simpleExplanation: [
      'Es la nota que le asignás a cada equipo (por ejemplo, 85 a un candidato al título y 60 a un equipo modesto).',
      'Cuanta más diferencia de rating haya entre dos equipos, mayores serán las probabilidades de que el equipo superior ataque mejor y genere goles.',
    ],
  },
  {
    id: 'home_advantage',
    title: 'Ventaja de Localía',
    badge: '+Bonus al Local',
    shortDesc: 'Otorga un impulso adicional al equipo que juega en su propio estadio.',
    simpleExplanation: [
      'En el fútbol real, jugar en casa ante tu público da un extra de energía. En la simulación se le suma un bonus al equipo local.',
      'Si dos equipos tienen exactamente el mismo rating (ejemplo: 70 vs 70), el local tendrá una leve ventaja estadística para anotar más goles.',
    ],
  },
  {
    id: 'lambda',
    title: 'Goles Esperados',
    badge: 'Promedio Lógico',
    shortDesc: 'Calcula cuántos goles es probable que anote cada equipo en el partido.',
    simpleExplanation: [
      'Comparamos el rendimiento general de un equipo contra el del rival (restando sus ratings y sumando la localía).',
      'Cuanto mayor sea la diferencia a favor de un equipo, mayor será su promedio estimado de goles. Por ejemplo: el local puede tener un estimado de 1.8 goles y el visitante de 0.9 goles.',
    ],
  },
  {
    id: 'poisson',
    title: 'Azar y Resultados Realistas',
    badge: 'Simulación de Partido',
    shortDesc: 'Genera los goles finales con un toque de azar realista para permitir sorpresas.',
    simpleExplanation: [
      'En el fútbol el mejor no siempre gana. Usamos una fórmula matemática (Poisson) que simula el azar de las jugadas.',
      'Aunque un equipo tenga un promedio de 2.0 goles esperados, el azar del partido puede hacer que termine convirtiendo 0, 1, 2, 3 o más goles, permitiendo empates y sorpresas.',
    ],
  },
];

export default function ModelInfoCard() {
  const [openCardId, setOpenCardId] = useState<string | null>(null);

  const handleToggleCard = (id: string) => {
    setOpenCardId((prev) => (prev === id ? null : id));
  };

  return (
    <Accordion
      defaultExpanded
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
            ¿Cómo funciona la simulación de partidos?
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.6 }}>
          La simulación calcula los resultados combinando la fuerza de los equipos, la ventaja de
          jugar en casa y el azar del fútbol real. Toca cualquiera de las tarjetas para desplegar la
          explicación paso a paso:
        </Typography>

        <Grid container spacing={2}>
          {PARAMETERS.map((param) => {
            const isExpanded = openCardId === param.id;

            return (
              <Grid key={param.id} size={{ xs: 12, sm: 6 }}>
                <Box
                  sx={{
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: isExpanded ? 'primary.main' : 'divider',
                    bgcolor: isExpanded ? 'action.selected' : 'action.hover',
                    transition: 'all 0.2s ease-in-out',
                    overflow: 'hidden',
                  }}
                >
                  {/* Encabezado clicleable */}
                  <Box
                    onClick={() => handleToggleCard(param.id)}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      userSelect: 'none',
                      '&:hover': {
                        bgcolor: 'action.focus',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, color: 'text.primary', flexGrow: 1 }}
                      >
                        {param.title}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={param.badge}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.72rem',
                            height: 24,
                            bgcolor: (theme) =>
                              theme.palette.mode === 'dark'
                                ? 'rgba(96, 165, 250, 0.16)'
                                : 'rgba(37, 99, 235, 0.1)',
                            color: (theme) =>
                              theme.palette.mode === 'dark' ? '#93c5fd' : '#1d4ed8',
                            border: '1px solid',
                            borderColor: (theme) =>
                              theme.palette.mode === 'dark'
                                ? 'rgba(147, 197, 253, 0.3)'
                                : 'rgba(29, 78, 216, 0.2)',
                          }}
                        />
                        <KeyboardArrowDownIcon
                          fontSize="small"
                          sx={{
                            color: 'text.secondary',
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease-in-out',
                          }}
                        />
                      </Box>
                    </Box>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', lineHeight: 1.4 }}
                    >
                      {param.shortDesc}
                    </Typography>
                  </Box>

                  {/* Contenido desplegable con la explicación completa en palabras fáciles */}
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <Box
                      sx={{
                        px: 2,
                        pb: 2,
                        pt: 1.5,
                        borderTop: '1px dashed',
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          color: 'primary.main',
                          display: 'block',
                          mb: 1,
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                        }}
                      >
                        Explicación paso a paso
                      </Typography>
                      {param.simpleExplanation.map((step) => (
                        <Typography
                          key={step}
                          variant="caption"
                          color="text.primary"
                          sx={{
                            display: 'block',
                            mb: 0.75,
                            lineHeight: 1.5,
                            fontSize: '0.78rem',
                            '&:last-child': { mb: 0 },
                          }}
                        >
                          • {step}
                        </Typography>
                      ))}
                    </Box>
                  </Collapse>
                </Box>
              </Grid>
            );
          })}
        </Grid>

        <Box sx={{ mt: 2.5, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">
            <strong>Reglas de Liga:</strong> 3 puntos por victoria, 1 por empate, 0 por derrota. Los
            desempates en la tabla de posiciones se definen por Puntos, Diferencia de Goles (DG),
            Goles a Favor (GF) y Partido Directo.
          </Typography>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
