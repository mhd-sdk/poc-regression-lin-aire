package dates

import "time"

// YYYY-MM-DD HH:MM:SS
func StringToTimestamp(dateStr string) (float64, error) {
	layout := "2006-01-02" // Go's reference time format
	t, err := time.Parse(layout, dateStr)
	if err != nil {
		return 0, err
	}
	return float64(t.Unix()), nil
}

// YYYY-MM-DD HH:MM:SS
func TimestampToString(timestamp float64) string {
	t := time.Unix(int64(timestamp), 0)
	return t.Format("2006-01-02")
}
