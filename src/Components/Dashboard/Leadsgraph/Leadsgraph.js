import React from "react";
import './Leadsgraph.css';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts';

import { dataset } from "../../../Data/Months";

export default function Leadsgraph(props) {
  const chartSetting = {
    yAxis: [
      {
        label: 'total no.of leads',
      },
    ],
    //width: 500,
    height: 300,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: 'translate(-5px, 0)',
      },
    },
  };
  const valueFormatter = (value) => `${value}`;
  return (
    <>
        
        {/* <BarChart
        xAxis={[{ scaleType: 'band', data: ['jan', 'feb', 'mar' ,'apr','may','june'] }]}
        series={[{ data: [4, 3, 5,7,8,9] }, { data: [1, 6, 3,4,8,2] }]}
        //   width={500}
        height={320}
        //   sx={{backgroundColor:'white',borderRadius:5}}
        className="leadsgraph-barchart"
        /> */}
        <BarChart
          dataset={props.leadsgraphlasttwelve.length>0?props.leadsgraphlasttwelve:dataset}
          xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
          series={[
            { dataKey: 'lo', label: 'open', valueFormatter },
            { dataKey: 'lc', label: 'closed', valueFormatter },
          ]}
      {...chartSetting}
    />
        <p className="leads-graph-below-text">total No.of leads opened and closed per month</p>
    </>
  );
}