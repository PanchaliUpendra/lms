import React from "react";
import { BarChart } from '@mui/x-charts/BarChart';

export default function Leadsgraph() {
  return (
    <BarChart
      xAxis={[{ scaleType: 'band', data: ['jan', 'feb', 'mar' ,'apr','may','june'] }]}
      series={[{ data: [4, 3, 5,7,8,9] }, { data: [1, 6, 3,4,8,2] }]}
    //   width={500}
      height={320}
    //   sx={{width:'100%'}}
    className="leadsgraph-barchart"
    />
  );
}