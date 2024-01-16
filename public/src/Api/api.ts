import axios from "axios";

// axios call to backend
export interface timeSeries {
    dates: string[];
    percentages: number[];
}


interface predictResponse {
    result: string;
}
export const getPredictedDate = async (data: timeSeries): Promise<predictResponse>  => {
  return (await axios.post(`http://localhost:3000/calc`, data)).data;
};

interface linearRegressionResponse {
    x: string[];
    intervalledX: number[];
    y: number[];
}
export const getLinearRegression = async (data: timeSeries): Promise<linearRegressionResponse>  => {
  return (await axios.post(`http://localhost:3000/calc/linear-regression`, data)).data;
};


