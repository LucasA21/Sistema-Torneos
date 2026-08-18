# Documentación Académica — Punto 2
# Sistema de Simulación de Liga y Torneos Deportivos

**Asignatura:** Modelos y Simulación — UNTDF  
**Carrera:** Licenciatura en Sistemas  
**Consigna:** Punto 2 — Simulación interactiva y funcional con justificación del sistema, modelo y simulación.

---

## 1. Descripción del Sistema Real

### 1.1 ¿Qué es un Sistema Deportivo de Liga?

Una competencia de liga (formato todos contra todos o *round-robin*) es un **sistema dinámico y estocástico** en el que un conjunto de $n$ equipos compiten entre sí durante un período de tiempo estructurado en **fechas (rondas)**. El objetivo del sistema es determinar, al finalizar todas las fechas, una **clasificación jerárquica** de los equipos según su desempeño acumulado.

### 1.2 Características del Sistema

| Propiedad | Descripción |
|---|---|
| **Dinámico** | El estado del sistema evoluciona con cada partido jugado |
| **Estocástico** | Los resultados de los partidos son aleatorios (no deterministas) |
| **Discreto** | El tiempo avanza en pasos discretos: fechas y partidos |
| **Cerrado** | El conjunto de equipos y el calendario son fijos antes del inicio |
| **Competitivo** | Los resultados de un equipo afectan la clasificación de todos los demás |

### 1.3 Fronteras del Sistema

**Lo que está DENTRO del sistema:**
- El conjunto de $n$ equipos participantes con sus atributos de habilidad.
- El calendario completo de partidos (fixture).
- El marcador de cada partido.
- La tabla de posiciones acumulada.
- Las zonas de clasificación (campeón, copas, descenso).

**Lo que está FUERA del sistema (simplificaciones del modelo):**
- Lesiones de jugadores individuales (no se modelan).
- Condiciones climáticas o del estadio.
- Variaciones de forma a lo largo del torneo (la habilidad es constante).
- Transferencias de jugadores entre fechas.
- Economía de los clubes.

### 1.4 Entidades del Sistema

```
┌─────────────────────────────────────────────────┐
│                   SISTEMA LIGA                   │
│                                                  │
│  ┌──────────┐    participa    ┌───────────────┐  │
│  │  EQUIPO  │ ──────────────► │    PARTIDO    │  │
│  │          │                 │               │  │
│  │ - nombre │ ◄────────────── │ - local       │  │
│  │ - rating │    genera       │ - visitante   │  │
│  │ - localía│                 │ - resultado   │  │
│  └──────────┘                 └───────┬───────┘  │
│                                       │          │
│                               actualiza          │
│                                       ▼          │
│                          ┌────────────────────┐  │
│                          │ TABLA POSICIONES   │  │
│                          │                    │  │
│                          │ - puntos           │  │
│                          │ - goles a favor    │  │
│                          │ - goles en contra  │  │
│                          └────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### 1.5 Entradas y Salidas

**Entradas (inputs):**
- Lista de $n$ equipos con nombre y rating de habilidad $[1, 100]$.
- Modalidad del torneo (liga simple o ida y vuelta).
- Factor de ventaja de localía (% boost al equipo local).

**Salidas (outputs):**
- Tabla de posiciones final ordenada.
- Historial completo de resultados partido a partido.
- En Monte Carlo: distribución de probabilidades de posiciones finales.

---

## 2. Justificación como Objeto de Simulación

La liga deportiva es un **candidato ideal para simulación** porque:

1. **No tiene solución analítica cerrada**: la distribución de posibles clasificaciones finales no puede calcularse directamente por la explosión combinatoria ($n!$ permutaciones posibles).
2. **La aleatoriedad es intrínseca**: incluso equipos con gran diferencia de nivel pueden perder partidos. La simulación captura esta variabilidad.
3. **El estado es trackeable**: podemos definir precisamente las variables de estado en cada instante.
4. **Permite comparar escenarios**: al variar los ratings o la ventaja de localía, podemos estudiar el impacto en las probabilidades de clasificación.
