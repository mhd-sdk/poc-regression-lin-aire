import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getLinearRegression, getPredictedDate } from "../Api/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DataItem {
  date: string;
  percentage: number;
}

const GraphAndTable: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([
    { date: "2024-01-01", percentage: 20 },
    { date: "2024-01-02", percentage: 25 },
    // ... additional data
  ]);

  const [linearRegressionData, setLinearRegressionData] = useState<DataItem[]>([]);
  const [intervalledData, setIntervalledData] = useState<number[]>([]);

  const handleDateChange = (index: number, newValue: string) => {
    const newData = [...data];
    newData[index].date = newValue;
    setData(newData);
  };

  const handlePercentageChange = (index: number, newValue: number) => {
    const newData = [...data];
    newData[index].percentage = newValue;
    setData(newData);
  };

  const handleDelete = (index: number) => {
    const newData = data.filter((_, idx) => idx !== index);
    setData(newData);
  };

  const graphData = {
    labels:data.map((item) => item.date),
    datasets: [
      {
        label: "Percentage",
        data:  data.map((item) => item.percentage),
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
      },

    ],
  };

  const graphData2 = {
    labels:linearRegressionData.map((item) => item.date),
    datasets: [
      {
        label: "Linear Regression",
        data: linearRegressionData.map((item) => item.percentage),
        fill: true,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgba(255, 99, 132, 0.2)",
      }
    ],
  };
  
  const [predictedDate, setPredictedDate] = useState<string>("");
  const handlePredict = async () => {
    const dates = data.map((item) => item.date);
    const percentages = data.map((item) => item.percentage);
    const predicted = await getPredictedDate({
      dates,
      percentages,
    });
    setPredictedDate(predicted.result);

    const linearRegression = await getLinearRegression({
      dates,
      percentages,
    });
    const linearRegressionDates = linearRegression.x;
    const linearRegressionPercentages = linearRegression.y;
    const intervalled = linearRegression.intervalledX;
    const linearRegressionData = linearRegressionDates.map((date, index) => ({
      date,
      percentage: linearRegressionPercentages[index],
    }));
    setLinearRegressionData(linearRegressionData);
    setIntervalledData(intervalled);

  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ width: "50%" }}>
        <Line data={graphData} />
        <Line data={graphData2} />
      </div>
      <div style={{ width: "50%" }}>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Percentage</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="date"
                    value={item.date}
                    onChange={(e) => handleDateChange(index, e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.percentage}
                    onChange={(e) =>
                      handlePercentageChange(index, Number(e.target.value))
                    }
                  />
                </td>
                <td>
                  <button onClick={() => handleDelete(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => setData([...data, { date: "", percentage: 0 }])}>
          Add
        </button>
        <button onClick={() => handlePredict()}>
          Predict next maintenance
        </button>
        {predictedDate && <p>Predicted date: {predictedDate}</p>}
      </div>
    </div>
  );
};

export default GraphAndTable;
