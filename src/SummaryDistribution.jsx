// @flow
import React from 'react';
import { createRefetchContainer, graphql} from 'react-relay';
import _ from 'lodash';
var BarChart = require("react-chartjs").Bar;
var LineChart = require("react-chartjs").Line;

import ServicesSelector from './ServicesSelector';
import seriesColors from './seriesColors';

// @import "~slick-carousel/slick/slick.css";
// @import "~slick-carousel/slick/slick-theme.css";

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

//const SummaryDistribution = ({title, totals, repository}) => {
class SummaryDistribution extends React.PureComponent {

    constructor(props) {
      super(props);
    }

    refetcher = (services) => {

      if( services ) {

        let servicesIds = services.split(",").map(Number);

        let variables = {
          servicesIds: servicesIds
        }

        this.props.relay.refetch(variables,
          null,
          () => {
          },
          {force: false}
        );
      }

    };

    render() {

        let todayDistribution = this.props.totals.todayDistribution;
      	let distribution = this.props.totals.distribution;
        let labels = _.concat(todayDistribution.labels, distribution.labels);

      	let datasets = distribution.datasets.map( (ds, index) => {

      		return {
      			data: ds.data,
      			label: ds.label,
      			fillColor: seriesColors[index].color,
      			strokeColor: seriesColors[index].auxColor,
      			pointColor: seriesColors[index].auxColor,
      			pointStrokeColor: "#fff",
      			pointHighlightFill: "#fff",
      			pointHighlightStroke: seriesColors[index].auxColor //"rgba(151,187,205,1)"
      		}
      	});

        for(let i = 0; i < datasets.length; i++ ) {
          datasets[i].data = _.concat(todayDistribution.datasets[i].data, datasets[i].data);
        }

      	let _chartData = {
      		labels: labels, // distribution.labels,
      		datasets: datasets
      	};

        var sliderSettings = {
          dots: true,
          infinite: true,
          speed: 500,
          slidesToShow: 1,
          slidesToScroll: 1
        };

        const styles = {
          legend: {
            float: 'right',
            right: '60px',
            width: '100%'
          },
          legendService: {
            backgroundColor: '#00223E',
            opacity: '.5',
            height: '2px',
            width: '14px'
          }
        }

        return (
          <div className="col-12">
            <div className="card esbCard">
              <div className="card-header">
                <h5>
                  <strong className="text-uppercase esbCaption">{this.props.title} </strong>
                </h5>
              </div>
              <div className="card-body">
                  <div style={styles.legend}>
                      <ServicesSelector services={this.props.repository}
                                       categories={this.props.repository.categories}
                                       refetcher={::this.refetcher}/>
                  </div>
                  <LineChart redraw data={_chartData} options={chartOptions}
                      width="1100" height="460"/>
              </div>
            </div>
          </div>
        );
    }
}

export default createRefetchContainer(SummaryDistribution,
graphql`
  fragment SummaryDistribution_totals on Runtime
	@argumentDefinitions(
		daysBefore: { type: "Int", defaultValue: 2 },
		servicesIds: { type: "[Int]!", defaultValue: [1,2] }
	)
	{
    todayDistribution: distribution(daysBefore: 0,
                                    servicesIds: $servicesIds) {
      labels
      datasets: series {
        label
        data
        serviceId
      }
    }
  	distribution(daysBefore: $daysBefore,
                  servicesIds: $servicesIds) {
      labels
      datasets: series { #alias
        label
        data
				serviceId
      }
    }
  }
`,
graphql`
query SummaryDistribution_RefetchQuery
(
  $daysBefore: Int,
  $servicesIds: [Int]!
)
{
  runtime {
    ...SummaryDistribution_totals @arguments(daysBefore: $daysBefore,
                                             servicesIds: $servicesIds)
  }
}
`);
