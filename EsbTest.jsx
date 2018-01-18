import React from 'react';
import { Chart } from 'react-google-charts';

class EsbTest extends React.Component {

  render() {

    let chartColumns = [
      {"id":"Stage","type":"string"},
      {"id":"Start","type":"date"},
      {"id":"End","type":"date"}
    ];

    let chartRows = [
      ["Pre-processing",new Date("2018-01-17T22:00:01.000Z"), new Date("2018-01-17T22:00:01.050Z")],
      ["Cross-domain",  new Date("2018-01-17T22:00:01.050Z"), new Date("2018-01-17T22:00:03.000Z")],
      ["Post-processing", new Date("2018-01-17T22:00:03.000Z"), new Date("2018-01-17T22:00:03.640Z")]
    ];

    return (<main className="main-container maxHeight">
              <Chart chartType="Timeline"
                 columns={chartColumns}
                 rows={chartRows}
                 options='width:600px'
                 width='100%'
                 chartPackage='timeline'
                 />
            </main>);
  }

};

export default EsbTest;
