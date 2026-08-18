# Regla 04: Motor de Simulación

## Principio Fundamental
El directorio `src/core/` es una **biblioteca pura**: cero dependencias de React, Next.js, MUI o cualquier
framework de UI. Debe poder ejecutarse en un entorno Node.js o en tests sin ningún setup especial.

## Función de Transición de Resultados de Partidos

### Fórmula de Rendimiento
```
rendimientoLocal = rating_local * (1 + HOME_ADVANTAGE) + gaussianNoise(μ=0, σ=NOISE_STD)
rendimientoVisitante = rating_visitante + gaussianNoise(μ=0, σ=NOISE_STD)
```

Constantes:
- `HOME_ADVANTAGE = 0.05` (5% boost al equipo local)
- `NOISE_STD = 15` (desviación estándar del ruido aleatorio)

### Generación de Goles
```
diferencia = rendimientoLocal - rendimientoVisitante
lambdaLocal = BASE_GOALS + max(0, diferencia) * GOAL_SCALE
lambdaVisitante = BASE_GOALS + max(0, -diferencia) * GOAL_SCALE

golesLocal = poissonRandom(lambdaLocal)
golesVisitante = poissonRandom(lambdaVisitante)
```

Constantes:
- `BASE_GOALS = 1.0` (goles mínimos esperados por equipo)
- `GOAL_SCALE = 0.03` (factor de escala diferencia→goles adicionales)

### Aproximación de Poisson
Para generar variables aleatorias Poisson usar el método de Knuth:
```
function poissonRandom(lambda): int
  L = e^(-lambda)
  k = 0, p = 1
  while p > L: k++, p *= random()
  return k - 1
```

### Aproximación Gaussiana (Box-Muller)
Para el ruido gaussiano usar la transformación Box-Muller:
```
u1, u2 = uniform(0, 1)
z = sqrt(-2 * ln(u1)) * cos(2π * u2)
return μ + σ * z
```

## Algoritmo Round-Robin (Rotación de Polígono)

Para N equipos (N par):
1. Fijar equipo 0 en posición 0.
2. Rotar los N-1 equipos restantes en cada fecha.
3. Cada fecha tiene N/2 partidos.
4. Total de fechas: N-1 (liga simple), 2*(N-1) (ida y vuelta).

Si N es impar, agregar un equipo "BYE" ficticio para completar el fixture.

## Tabla de Posiciones

Ordenamiento multi-criterio (en orden de prioridad):
1. Puntos (victoria=3, empate=1, derrota=0)
2. Diferencia de goles (GF - GC)
3. Goles a favor (GF)
4. Enfrentamiento directo (si aplica)

## Ejecución Monte Carlo — Chunks Asíncronos

Para no bloquear el hilo principal de React:
```typescript
async function runMonteCarloSimulation(config, N, onProgress) {
  const CHUNK_SIZE = 100;
  const results = [];
  for (let i = 0; i < N; i += CHUNK_SIZE) {
    const chunk = Math.min(CHUNK_SIZE, N - i);
    for (let j = 0; j < chunk; j++) {
      results.push(runFullTournament(config));
    }
    onProgress((i + chunk) / N);
    await new Promise(resolve => setTimeout(resolve, 0)); // yield to browser
  }
  return aggregateResults(results);
}
```

## Reproducibilidad
- Para debugging, las funciones del core aceptan un parámetro `seed` opcional.
- En producción usar `Math.random()` estándar.
