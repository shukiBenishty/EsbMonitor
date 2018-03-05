// @flow
import React from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import environment from './Environment';

import SummaryCalls from './SummaryCalls';
import SummaryLatency from './SummaryLatency';
import SummaryErrors from './SummaryErrors';
import SummaryDistribution from './SummaryDistribution';

const summariesQuery = graphql`
	query DashboardTotals_Query ($totalCallsBefore: Date,
															 $totalLatencyBefore: Date,
															 $totalErrorsBefore: Date,
															 $daysBefore: Int,
															 $servicesIds: [Int]!)
 {
		runtime {
			...SummaryCalls_totals @arguments(before: $totalCallsBefore)
			...SummaryLatency_totals @arguments(before: $totalLatencyBefore)
			...SummaryErrors_totals @arguments(before: $totalErrorsBefore)
			...SummaryDistribution_totals @arguments(daysBefore: $daysBefore,
																							 servicesIds: $servicesIds)
		}
	}
`;

class Dashboard extends React.Component<{}> {


	renderSummaries({error, props}) {
		if( error ) {
			return (<main className="main-container">
                  <div className="main-content graphqlConnectionError">
                    {error.message}
                  </div>
              </main>)
		} else if ( props ) {
			return <React.Fragment>
								<SummaryCalls title='Total Calls' totals={props.runtime} />
								<SummaryLatency title='Latency' totals={props.runtime} />
								<SummaryErrors title='Errors' totals={props.runtime}/>
								<SummaryDistribution title='Calls Distribution' totals={props.runtime} />
						 </React.Fragment>
		}

		return <div>Loading...</div>
	}

  render() {

		let queryVariables = {
			totalCallsBefore: 1,
			totalLatencyBefore: 1,
			totalErrorsBefore: 1,
			daysBefore: 7,
			servicesIds: [1,3]
		}

    return (<main className="main-container">
              <div className="main-content">
                <div className="row">
									<QueryRenderer
										environment={environment}
										query={summariesQuery}
										variables={queryVariables}
										render={this.renderSummaries}
									/>
                </div>
              </div>
            </main>
            );
  }

}

export default Dashboard;
