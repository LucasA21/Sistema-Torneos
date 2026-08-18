# Explicación Sencilla del Modelo de Simulación ⚽🎲

Esta guía explica en **palabras simples y cotidianas** (sin términos académicos ni fórmulas complejas) exactamente cómo funciona el motor matemático del simulador de torneos.

---

## 💡 Los 4 Pasos para Simular un Partido

Para simular un partido entre dos equipos (por ejemplo, **Local** vs **Visitante**), el sistema realiza **4 pasos consecutivos**:

```
[ 1. Rating y Localía ] ➔ [ 2. El Día del Partido (Ruido) ] ➔ [ 3. Goles Esperados (λ) ] ➔ [ 4. Azar de los Goles (Poisson) ] ➔ 🏆 Marcador Final
```

---

### Paso 1: Fuerza Inicial (Rating + Localía)

Cada equipo tiene un **Rating** de 1 a 100 que representa su calidad general (plantel, figuras, momento):
* Un equipo candidato puede tener **Rating 85**.
* Un equipo humilde puede tener **Rating 65**.

Además, por jugar en su estadio ante su hinchada, el equipo **Local** recibe automáticamente un **extra de localía** (por defecto +5% de bonus).

* **Local (Rating 85):** $85 \times 1.05 = 89.25$ puntos de fuerza.
* **Visitante (Rating 65):** $65.00$ puntos de fuerza.

---

### Paso 2: El "Día del Partido" (El Ruido Aleatorio)

En la vida real, los equipos no juegan exactamente igual todos los domingos. A veces la figura se levanta con dolor de panza, hace frío, hay mal pasto o expulsan a alguien temprano.

A ese factor impredecible lo llamamos **Ruido del Partido**:
* El sistema genera un **número al azar** para cada equipo (con forma de curva normal o campana).
* Es más probable que el ruido sea pequeño ($\pm 2, \pm 5$), pero de vez en cuando sale un ruido grande ($\pm 15$ o $\pm 20$).

**Ejemplo de una fecha:**
* El **Local** tiene un mal día (Ruido de $-12$) $\rightarrow$ Fuerza en la cancha: $89.25 - 12 = \mathbf{77.25}$.
* El **Visitante** tiene un día de gracia (Ruido de $+15$) $\rightarrow$ Fuerza en la cancha: $65 + 15 = \mathbf{80.00}$.

¡En este partido particular, el visitante superó al local en la cancha por $2.75$ puntos!

---

### Paso 3: Goles Esperados (Promedio $\lambda$)

Ahora el sistema traduce esa diferencia de fuerza en la cancha a un **promedio esperado de goles** ($\lambda$) para el partido:

1. **Goles Base:** Todo partido empieza imaginando que ambos meterán al menos **1 gol base** por presencia.
2. **Premio al mejor:** El equipo con mayor fuerza en la cancha recibe un **extra de goles esperados** proporcional a la diferencia.

**Continuando con el ejemplo:**
* Como el **Visitante** superó al local por $2.75$ puntos:
  * **Goles esperados del Visitante ($\lambda$):** $1.0 + (2.75 \times 0.03) = \mathbf{1.08\text{ goles}}$.
  * **Goles esperados del Local ($\lambda$):** $\mathbf{1.00\text{ gol}}$.

---

### Paso 4: El Azar de las Jugadas (Distribución de Poisson)

#### ¿Qué es la Distribución de Poisson en palabras simples?
Imagina que un delantero tiene un promedio estadístico de meter **1.08 goles por partido**. ¿Significa que en *este* partido va a meter exactamente $1.08$ goles? ¡Imposible! No existen los fracciones de gol.

La **Distribución de Poisson** es la bolsita de canicas de la suerte que convierte ese promedio ($1.08$) en **números enteros reales (0, 1, 2, 3, 4...)**:

* En esa bolsita para un promedio de $1.08$:
  * 34% de las canicas dicen **0 goles** (erró los tiros).
  * 37% de las canicas dicen **1 gol** (marcó un gol).
  * 20% de las canicas dicen **2 goles** (doblete).
  * 9% de las canicas dicen **3 o más goles** (goleada).

El sistema mete la mano en la bolsita de Poisson para cada equipo:
* Sacó canica para el **Local** (promedio $1.00$) $\rightarrow$ Sale **0 goles**.
* Sacó canica para el **Visitante** (promedio $1.08$) $\rightarrow$ Sale **2 goles**.

### 🏁 Marcador Final del Partido:
$$\mathbf{\text{Local } 0 - 2 \text{ Visitante}}$$

¡El equipo con menor rating (65) le ganó de visitante al favorito (85)!

---

## 🔮 ¿Qué es la Simulación de Monte Carlo?

Si juegas un torneo una sola vez, puede que el equipo humilde salga campeón por un golpe de suerte descomunal.

La **Simulación de Monte Carlo** consiste en repetir **1.000 veces el torneo entero** de principio a fin en milisegundos:

1. Simula los 1.000 torneos.
2. Cuenta cuántas veces salió campeón cada equipo.
3. Si el equipo de Rating 85 salió campeón en 650 torneos, su **probabilidad de ser Campeón es del 65%**.
4. Si el equipo de Rating 65 salió campeón en 20 torneos, su **probabilidad es del 2%**.

De esta forma, combinamos el **azar realista de un partido** con la **certeza estadística del largo plazo**.
