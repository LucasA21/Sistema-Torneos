# Especificación del Modelo de Torneo

**Asignatura:** Modelos y Simulación — UNTDF

---

## 1. Definición Formal del Modelo

Un **modelo** es una abstracción simplificada del sistema real que captura los aspectos relevantes para el estudio. Nuestro modelo es un **sistema de eventos discretos estocástico** donde:

- El tiempo avanza en pasos discretos (un partido o una fecha).
- Las transiciones de estado son probabilísticas (resultado del partido).
- El estado del sistema está completamente determinado por la historia de partidos jugados.

### 1.1 Espacio de Estados

El **estado** del sistema en un instante $t$ (después de $t$ partidos jugados) es:

$$S_t = (M_t, T_t)$$

Donde:
- $M_t$: conjunto de $t$ partidos con resultado conocido.
- $T_t$: tabla de posiciones actualizada (función determinista de $M_t$).

El **estado inicial** es $S_0 = (\emptyset, T_0)$ donde $T_0$ tiene todos los equipos con 0 puntos.

El **estado final** es $S_F$ cuando se han jugado todos los $F = n(n-1)$ partidos (liga simple) o $F = 2n(n-1)$ (ida y vuelta).

### 1.2 Variables de Estado

| Variable | Tipo | Descripción |
|---|---|---|
| `matchesPlayed` | `Match[]` | Lista de partidos con resultados |
| `matchesPending` | `Match[]` | Lista de partidos pendientes |
| `currentRound` | `number` | Fecha actual (1..N) |
| `standings` | `StandingsEntry[]` | Tabla de posiciones ordenada |
| `isComplete` | `boolean` | Si el torneo ha finalizado |

### 1.3 Parámetros del Modelo

| Parámetro | Símbolo | Valor por defecto | Descripción |
|---|---|---|---|
| Habilidad del equipo | $r_i$ | $[1, 100]$ | Rating base del equipo $i$ |
| Ventaja de localía | $\alpha$ | $0.05$ | Boost porcentual al equipo local |
| Desviación del ruido | $\sigma$ | $15$ | Dispersión del rendimiento en un partido |
| Goles base | $\lambda_0$ | $1.0$ | Goles esperados mínimos por equipo |
| Escala de goles | $\gamma$ | $0.03$ | Conversión diferencia de rendimiento → goles |

---

## 2. Función de Transición Estocástica

### 2.1 Modelo de Rendimiento en un Partido

Dado un partido entre el equipo local $i$ y el visitante $j$, definimos las **variables de rendimiento** como:

$$P_i = r_i \cdot (1 + \alpha) + \varepsilon_i, \quad \varepsilon_i \sim \mathcal{N}(0, \sigma^2)$$

$$P_j = r_j + \varepsilon_j, \quad \varepsilon_j \sim \mathcal{N}(0, \sigma^2)$$

El **ruido gaussiano** $\varepsilon$ modela la variabilidad inherente al rendimiento deportivo: lesiones menores, estado de ánimo, condiciones del día, etc.

### 2.2 Modelo de Generación de Goles

La **diferencia de rendimiento relativo** determina cuántos goles esperamos:

$$\Delta = P_i - P_j$$

Los goles esperados siguen una distribución de Poisson con parámetros:

$$\lambda_i = \lambda_0 + \max(0, \Delta) \cdot \gamma$$
$$\lambda_j = \lambda_0 + \max(0, -\Delta) \cdot \gamma$$

Los goles efectivos se samplea de:
$$G_i \sim \text{Poisson}(\lambda_i), \quad G_j \sim \text{Poisson}(\lambda_j)$$

La distribución de Poisson es apropiada para modelar goles porque:
1. Los goles son **conteos de eventos** en un intervalo de tiempo fijo.
2. Los goles son **independientes entre sí** (aproximación razonable).
3. La distribución de Poisson ha sido empíricamente validada en la literatura de estadística deportiva.

### 2.3 Determinación del Resultado

$$\text{resultado}(i, j) = \begin{cases}
\text{Victoria local} & \text{si } G_i > G_j \\
\text{Empate} & \text{si } G_i = G_j \\
\text{Victoria visitante} & \text{si } G_i < G_j
\end{cases}$$

### 2.4 Actualización de la Tabla

La función de actualización de puntos $\phi$ aplica las reglas estándar:

$$\phi(\text{Victoria}) = +3 \text{ pts al ganador, } +0 \text{ al perdedor}$$
$$\phi(\text{Empate}) = +1 \text{ pt a cada equipo}$$

---

## 3. Función de Ordenamiento (Tabla de Posiciones)

La función de ranking $\rho: \text{StandingsEntry}[] \rightarrow \text{StandingsEntry}[]$ ordena según criterios lexicográficos:

$$\rho = \text{sort por: } (\text{Pts DESC}, \Delta G \text{ DESC}, GF \text{ DESC})$$

Donde $\Delta G = GF - GC$ (diferencia de gol) y $GF$ son los goles a favor.

---

## 4. Propiedades del Modelo

### 4.1 Ergodicidad
Para cualquier conjunto de equipos con habilidades distintas, el campeón puede ser cualquier equipo (probabilidad > 0 siempre), aunque con probabilidades muy distintas. El modelo es **no determinista**.

### 4.2 Sensibilidad al Rating
La diferencia de rating $\Delta r = r_i - r_j$ afecta la **distribución** del resultado pero no lo determina. Con $\sigma = 15$, una diferencia de 30 puntos de rating implica aproximadamente 60-70% de probabilidad de victoria para el equipo superior.

### 4.3 Convergencia en Monte Carlo
Por la **Ley de los Grandes Números**, la frecuencia empírica de cada resultado converge a su probabilidad teórica cuando $N \rightarrow \infty$. En la práctica, $N = 1000$ provee estimaciones con error estándar $< 1.5\%$ para probabilidades en el rango $[0.1, 0.9]$.
