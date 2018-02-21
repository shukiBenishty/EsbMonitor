import React from 'react';
import { createFragmentContainer, graphql} from 'react-relay';

var LineChart = require("react-chartjs").Line;

//
// Chart data should be shaped as follows:
//
// var chartData = {
// 	labels: ["January", "February", "March", "April", "May", "June", "July"],
// 	datasets: [
// 		{
// 			label: "Send SMS",
// 			fillColor: "rgba(220,220,220,0.2)",
// 			strokeColor: "rgba(220,220,220,1)",
// 			pointColor: "rgba(220,220,220,1)",
// 			pointStrokeColor: "#fff",
// 			pointHighlightFill: "#fff",
// 			pointHighlightStroke: "rgba(220,220,220,1)",
// 			data: [65000, 59000, 80000, 81000, 56000, 55000, 40000]
// 		},
// 		{
// 			label: "GetCustomerProfile(CRM)",
// 			fillColor: "rgba(151,187,205,0.2)",
// 			strokeColor: "rgba(151,187,205,1)",
// 			pointColor: "rgba(151,187,205,1)",
// 			pointStrokeColor: "#fff",
// 			pointHighlightFill: "#fff",
// 			pointHighlightStroke: "rgba(151,187,205,1)",
// 			data: [28000, 48000, 40000, 19000, 86000, 27000, 90000]
// 		}
// 	]
// };

var chartOptions = {
  ///Boolean - Whether grid lines are shown across the chart
  scaleShowGridLines : true,

  //String - Colour of the grid lines
  scaleGridLineColor : "rgba(0,0,0,.05)",

  //Boolean - Whether to fill the dataset with a colour
  datasetFill : true,
}

const SummaryDistribution = ({title, totals, relay}) => {

	let distribution = totals.distribution;

	let datasets = distribution.datasets.map( (ds, index) => {

		return {
			data: ds.data,
			label: ds.label,
			fillColor: "rgba(151,187,205,0.2)",
			strokeColor: "rgba(151,187,205,1)",
			pointColor: "rgba(151,187,205,1)",
			pointStrokeColor: "#fff",
			pointHighlightFill: "#fff",
			pointHighlightStroke: "rgba(151,187,205,1)"
		}
	});

	let _chartData = {
		labels: distribution.labels,
		datasets: datasets
	};

  return (
    <div className="col-12">
      <div className="card esbCard">
        <div className="card-header">
          <h5>
            <strong className="text-uppercase esbCaption">{title} </strong>
          </h5>
        </div>
        <div className="card-body">
          <LineChart data={_chartData} options={chartOptions}
            width="1100" height="460"/>
        </div>
      </div>
    </div>
  );

}

export default createFragmentContainer(SummaryDistribution,
graphql`
  fragment SummaryDistribution_totals on Runtime
	@argumentDefinitions(
		daysBefore: { type: "Int", defaultValue: 2 },
		servicesIds: { type: "[Int]!", defaultValue: [1,2] }
	)
	{
  	distribution(daysBefore: $daysBefore, servicesIds: $servicesIds) {
      labels
      datasets: series { #alias
        label
        data
				serviceId
      }
    }
  }
`);
