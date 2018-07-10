import React from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import environment from './Environment';
import Navigation from './Navigation';

const errorsQuery = graphql`
	query NavigationRenderer_Query ($daysBefore: Date)
 {
		runtime {
			...Navigation_totals @arguments(before: $daysBefore)
		}
	}
`;

class NavigationRenderer extends React.Component{

  renderErrors({error, props}) {
    if( error ) {
      return <div>{error.message}</div>
    } else if ( props ) {
      return <Navigation totals={props.runtime}/>;
    }

    return <div>Loading...</div>
  }

  render() {

    let queryVariables = {
			daysBefore: 1 // Actually we want to get errors just for today,
										// but in order to not duplicate GQL queries with Dashbord,
										// we're quering with {before: 1}. Hence, Relay Store will remember
										// only one linkedRecord for both
		}

     return <QueryRenderer
                  environment={environment}
                  query={errorsQuery}
                  variables={queryVariables}
                  render={this.renderErrors}
            />
  }

}

export default NavigationRenderer;
