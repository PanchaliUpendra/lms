import React from "react";
import './Leadsgraph.css';
import { BarChart } from '@mui/x-charts/BarChart';

export default function Ticketsgraph() {
  return (
    <>
        <div className="leadsgraph-indicators-con">
            {/* opened */}
            <div className="leadsgraph-indicator">
                <div className="leads-graph-each-color-indicator-open"></div>
                <p>open</p>
            </div>
            {/* closed */}
            <div className="leadsgraph-indicator">
                <div className="leads-graph-each-color-indicator-close"></div>
                <p>closed</p>
            </div>
        </div>
        <BarChart
        xAxis={[{ scaleType: 'band', data: ['jan', 'feb', 'mar' ,'apr','may','june'] }]}
        series={[{ data: [4, 3, 5,7,8,9] }, { data: [1, 6, 3,4,8,2] }]}
        //   width={500}
        height={320}
        //   sx={{backgroundColor:'white',borderRadius:5}}
        className="leadsgraph-barchart"
        />
        <p className="leads-graph-below-text">total No.of Tickets opened and closed per month</p>
    </>
  );
}