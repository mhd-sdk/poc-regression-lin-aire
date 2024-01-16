package linearregression

import (
	"math"

	"gonum.org/v1/gonum/stat"
)

// predictNextMaintenance prédit la date du prochain besoin de maintenance.
func PredictNextMaintenance(dates []float64, percentages []float64) float64 {
	// Calculer les coefficients de la régression linéaire.
	alpha, beta := stat.LinearRegression(dates, percentages, nil, false)

	// Prédire la date de maintenance suivante lorsque le pourcentage atteint 100.
	predictedDate := (100 - alpha) / beta

	return predictedDate
}

func CalculateLinearRegression(dates []float64, percentages []float64) (linearX []float64, requestedX []float64, linearY []float64) {
	// Calculer les coefficients de la régression linéaire.
	alpha, beta := stat.LinearRegression(dates, percentages, nil, false)

	// Prédire la date de maintenance suivante lorsque le pourcentage atteint 100.
	predictedDate := (100 - alpha) / beta

	// Créer les points de la ligne à des intervalles réguliers pour la régression linéaire
	var x []float64
	var y []float64
	minX := dates[0]
	maxX := predictedDate
	numPoints := 10 // Nombre de points à interpoler pour la régression
	interval := (maxX - minX) / float64(numPoints-1)

	for i := 0; i < numPoints; i++ {
		newX := minX + float64(i)*interval
		newY := alpha + beta*newX
		x = append(x, newX)
		y = append(y, newY)
	}

	// Créer les pourcentages à intervalles réguliers
	requestedX = make([]float64, numPoints)
	j := 0
	for i := 0; i < numPoints; i++ {
		if j < len(dates) && math.Abs(x[i]-dates[j]) < interval/2 {
			requestedX[i] = percentages[j]
			j++
		} else {
			requestedX[i] = -1
		}
	}

	return x, requestedX, y
}
