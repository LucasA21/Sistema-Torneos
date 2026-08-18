# Mecánica de Simulación

**Asignatura:** Modelos y Simulación — UNTDF

---

## 1. Tipos de Simulación Implementados

El sistema implementa **dos modos de simulación** con objetivos distintos pero compartiendo el mismo motor estocástico base:

| Modo | Objetivo | Técnica |
|---|---|---|
| **Paso a Paso** | Observar el desarrollo de UN torneo partido a partido | Simulación por eventos discretos |
| **Monte Carlo** | Estimar probabilidades de resultados posibles | Simulación masiva repetida |

---

## 2. Simulación por Eventos Discretos (Paso a Paso)

### 2.1 Concepto

La simulación por **eventos discretos** modela el avance del sistema de un estado a otro mediante **eventos** que ocurren en instantes de tiempo discretos. En nuestro caso:

- **Evento atómico**: Simular un partido → actualiza marcador y tabla de posiciones.
- **Evento compuesto**: Simular una fecha → dispara $n/2$ eventos atómicos seguidos.
- **Evento total**: Simular el torneo completo → dispara todas las fechas.

### 2.2 Avance Temporal

```
Estado S_0 (torneo iniciado)
        │
        ▼ [Evento: simular partido (i, j) en Fecha 1]
Estado S_1 (1 partido jugado, tabla actualizada)
        │
        ▼ [Evento: simular partido (k, l) en Fecha 1]
Estado S_2 (2 partidos jugados, tabla actualizada)
        │
        ▼ ...
        │
        ▼ [Evento: simular último partido]
Estado S_F (torneo completo, posiciones finales)
```

### 2.3 Diagrama de Flujo

```
┌─────────────────────────────────────────────────────┐
│                  SIMULACIÓN PASO A PASO              │
│                                                      │
│  ┌──────────────┐                                    │
│  │ Inicializar  │                                    │
│  │ Fixture      │                                    │
│  └──────┬───────┘                                    │
│         │                                            │
│         ▼                                            │
│  ┌──────────────┐    ┌──────────────────────────┐   │
│  │ ¿Hay         │ Sí │ Seleccionar próximo       │   │
│  │ partidos     ├───►│ partido pendiente         │   │
│  │ pendientes?  │    └──────────┬───────────────┘   │
│  └──────┬───────┘               │                    │
│         │ No                    ▼                    │
│         │              ┌────────────────┐            │
│         │              │ Generar ruido  │            │
│         │              │ gaussiano ε    │            │
│         ▼              └──────┬─────────┘            │
│  ┌──────────────┐             │                      │
│  │ TORNEO       │             ▼                      │
│  │ COMPLETO     │    ┌────────────────┐              │
│  │ (estado fin) │    │ Calcular P_i   │              │
│  └──────────────┘    │ y P_j          │              │
│                      └──────┬─────────┘              │
│                             │                        │
│                             ▼                        │
│                    ┌────────────────┐                │
│                    │ Sample Poisson │                │
│                    │ G_i ~ Pois(λ_i)│                │
│                    │ G_j ~ Pois(λ_j)│                │
│                    └──────┬─────────┘                │
│                           │                          │
│                           ▼                          │
│                  ┌────────────────────┐              │
│                  │ Actualizar tabla   │              │
│                  │ de posiciones      │              │
│                  └────────────────────┘              │
└─────────────────────────────────────────────────────┘
```

---

## 3. Simulación Monte Carlo

### 3.1 Fundamento Teórico

El **Método de Monte Carlo** es una técnica de simulación estadística que usa la generación de números aleatorios para estimar cantidades difíciles de calcular analíticamente. Su fundamento es la **Ley de los Grandes Números (LGN)**:

> **Ley de los Grandes Números (LGN):** Dado un experimento aleatorio con probabilidad $p$ de éxito, si se repite $N$ veces de forma independiente, la frecuencia relativa de éxitos $\hat{p}_N$ converge en probabilidad a $p$ cuando $N \rightarrow \infty$:
>
> $$\hat{p}_N = \frac{\text{número de éxitos}}{N} \xrightarrow{N \to \infty} p$$

### 3.2 Aplicación al Torneo

Para estimar la probabilidad de que el equipo $i$ sea campeón:

1. Repetir $N$ veces:
   - Simular un torneo completo con nueva semilla aleatoria.
   - Registrar el campeón (posición 1 en la tabla final).
2. Calcular:
$$\hat{P}(\text{equipo } i \text{ es campeón}) = \frac{\text{torneos donde } i \text{ fue campeón}}{N}$$

### 3.3 Error de Estimación

El **error estándar** de una estimación Monte Carlo para una proporción $p$ con $N$ muestras es:

$$SE = \sqrt{\frac{p(1-p)}{N}}$$

Para $p = 0.5$ (peor caso) y distintos valores de $N$:

| $N$ | Error estándar ($SE$) | Intervalo de confianza 95% |
|---|---|---|
| 100 | ±5.0% | ±9.8% |
| 1.000 | ±1.6% | ±3.1% |
| 5.000 | ±0.7% | ±1.4% |
| 10.000 | ±0.5% | ±1.0% |

**Recomendación práctica**: $N \geq 1.000$ para estimaciones útiles; $N = 5.000$ para análisis detallado.

### 3.4 Implementación Asíncrona (Chunks)

Para no congelar la interfaz de usuario durante simulaciones masivas, el motor ejecuta el Monte Carlo en **chunks de 100 torneos**, cediendo el control al browser entre cada chunk:

```
Iteración 1..100   → simular → yield (0% → 1%)
Iteración 101..200 → simular → yield (1% → 2%)
...
Iteración N-99..N  → simular → yield (99% → 100%)
```

La función `setTimeout(resolve, 0)` o `Promise.resolve()` permite al event loop de JavaScript procesar eventos de UI (actualizaciones de `LinearProgress`, clics del usuario) entre cada chunk.

### 3.5 Estadísticas Recopiladas

Por cada equipo, el módulo `statistics.ts` calcula:

| Estadística | Fórmula |
|---|---|
| P(campeón) | Frecuencia relativa de posición 1 |
| P(copa) | Frecuencia relativa de posiciones 2-4 |
| P(descenso) | Frecuencia relativa de últimas 3 posiciones |
| Posición promedio | $\bar{k}_i = \frac{1}{N}\sum_{t=1}^N k_i^{(t)}$ |
| Puntos promedio | $\bar{p}_i = \frac{1}{N}\sum_{t=1}^N p_i^{(t)}$ |
| Distribución de posiciones | Histograma discreto de posiciones 1..n |

---

## 4. Generación de Números Pseudoaleatorios

El sistema usa el generador `Math.random()` nativo de JavaScript (implementación Xorshift128+ en V8), que tiene **período suficientemente largo** para simulaciones de escala académica ($< 10^6$ partidos totales).

Para reproducibilidad en debugging, las funciones del core aceptan un parámetro `rng` (función generadora reemplazable), lo que permite inyectar un generador con semilla fija en tests.
