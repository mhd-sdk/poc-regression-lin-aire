package main

import (
	"log"
	"regression-lineaire/pkg/dates"
	"regression-lineaire/pkg/linearregression"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

type Data struct {
	Dates       []string  `json:"dates"`
	Percentages []float64 `json:"percentages"`
}

func main() {
	app := fiber.New()
	app.Use(cors.New())
	app.Post("/calc", func(c *fiber.Ctx) error {
		data := new(Data)
		if err := c.BodyParser(data); err != nil {
			return err
		}
		timestamps := make([]float64, len(data.Dates))
		for i, date := range data.Dates {
			timestamps[i], _ = dates.StringToTimestamp(date)
		}

		result := linearregression.PredictNextMaintenance(timestamps, data.Percentages)

		dateResult := dates.TimestampToString(result)

		return c.JSON(fiber.Map{
			"result": dateResult,
		})
	})

	app.Post("/calc/linear-regression", func(c *fiber.Ctx) error {
		data := new(Data)
		if err := c.BodyParser(data); err != nil {
			return err
		}
		timestamps := make([]float64, len(data.Dates))
		for i, date := range data.Dates {
			timestamps[i], _ = dates.StringToTimestamp(date)
		}

		linearX, intervalledX, linearY := linearregression.CalculateLinearRegression(timestamps, data.Percentages)

		var xDates []string
		for _, timestamp := range linearX {
			xDates = append(xDates, dates.TimestampToString(timestamp))
		}

		return c.JSON(fiber.Map{
			"x":            xDates,
			"intervalledX": intervalledX,
			"y":            linearY,
		})
	})

	log.Fatal(app.Listen(":3000"))
}
