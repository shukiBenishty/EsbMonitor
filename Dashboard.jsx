// @flow
import React from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import environment from './Environment';

import SummaryCalls from './SummaryCalls';
import SummaryLatency from './SummaryLatency';
import SummaryErrors from './SummaryErrors';
import SummaryDistribution from './SummaryDistribution';

const summariesQuery = graphql`
	query DashboardTotals_Query {
		runtime {
			...SummaryCalls_totals
			...SummaryLatency_totals
			...SummaryErrors_totals
			...SummaryDistribution_totals
		}
	}
`;

class Dashboard extends React.Component<{}> {


	renderSummaries({error, props}) {
		if( error ) {
			return <div>{error.message}</div>
		} else if ( props ) {
			return <React.Fragment>
								<SummaryCalls title='Total Calls' totals={props.runtime} />
								<SummaryLatency title='Latency' />
								<SummaryErrors title='Errors' />
								<SummaryDistribution title='Calls Distribution' />
						 </React.Fragment>
		}

		return <div>Loading...</div>
	}

  render() {

    return (<main className="main-container">
              <div className="main-content">
                <div className="row">
									<QueryRenderer
										environment={environment}
										query={summariesQuery}
										variables={{}}
										render={this.renderSummaries}
									/>
                </div>
              </div>
            </main>
            );
  }

}

export default Dashboard;
