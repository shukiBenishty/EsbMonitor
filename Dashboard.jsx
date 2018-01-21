// @flow
import React from 'react';
var LineChart = require("react-chartjs").Line;

var chartData = {
	labels: ["January", "February", "March", "April", "May", "June", "July"],
	datasets: [
		{
			label: "Send SMS",
			fillColor: "rgba(220,220,220,0.2)",
			strokeColor: "rgba(220,220,220,1)",
			pointColor: "rgba(220,220,220,1)",
			pointStrokeColor: "#fff",
			pointHighlightFill: "#fff",
			pointHighlightStroke: "rgba(220,220,220,1)",
			data: [65000, 59000, 80000, 81000, 56000, 55000, 40000]
		},
		{
			label: "GetCustomerProfile(CRM)",
			fillColor: "rgba(151,187,205,0.2)",
			strokeColor: "rgba(151,187,205,1)",
			pointColor: "rgba(151,187,205,1)",
			pointStrokeColor: "#fff",
			pointHighlightFill: "#fff",
			pointHighlightStroke: "rgba(151,187,205,1)",
			data: [28000, 48000, 40000, 19000, 86000, 27000, 90000]
		}
	]
};

var chartOptions = {
  ///Boolean - Whether grid lines are shown across the chart
  scaleShowGridLines : true,

  //String - Colour of the grid lines
  scaleGridLineColor : "rgba(0,0,0,.05)",

  //Boolean - Whether to fill the dataset with a colour
  datasetFill : true,
}

class Dashboard extends React.Component<{}> {

  constructor() {

    super();

    this.styles = {
      progressBar : {
        width: "65%",
        height: "4px"
      }
    }

  }

  render() {
    return (<main className="main-container">
              <div className="main-content">
                <div className="row">
                  <div className="col-lg-4">
                    <div className="card card-body">
                      <h6>
                        <span className="text-uppercase">Total calls</span>
                        <span className="float-right">
                          <a className="btn btn-xs btn-primary" href="#">View</a>
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">17.876</p>
                      <div className="progress">
                        <div className="progress-bar" role="progressbar" style={this.styles.progressBar}>
                        </div>
                      </div>
                      <div className="text-gray fs-12">
                        <i className="ti-stats-up text-success mr-1" aria-hidden="true"></i>%18 decrease from last day
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4">
                    <div className="card card-body">
                      <h6>
                        <span className="text-uppercase">Latency</span>
                        <span className="float-right">
                          <a className="btn btn-xs btn-primary" href="#">View</a>
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">0.13 sec.</p>
                      <div className="progress">
                        <div className="progress-bar bg-danger" role="progressbar"style={this.styles.progressBar}>
                        </div>
                      </div>
                      <div className="text-gray fs-12">
                        <i className="ti-stats-down text-danger mr-1"></i>%18 decrease from last hour
                      </div>

                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4">
                    <div className="card card-body">
                      <h6>
                        <span className="text-uppercase">Errors</span>
                        <span className="float-right">
                          <a className="btn btn-xs btn-primary" href="#">View</a>
                        </span>
                      </h6>
                      <br />
                      <p className="fs-28 fw-100">3</p>
                      <div className="progress">
                        <div className="progress-bar bg-danger" role="progressbar" style={this.styles.progressBar}>
                        </div>
                      </div>
                      <div className="text-gray fs-12">
                        <i className="ti-stats-down text-danger mr-1"></i>%3 decrease from last hour
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header">
                        <h5>
                          <strong>Calls Distribution</strong>
                        </h5>
                      </div>
                      <div className="card-body">
                        <LineChart data={chartData} options={chartOptions}
                          width="1100" height="460"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
            );
  }

}

export default Dashboard;
