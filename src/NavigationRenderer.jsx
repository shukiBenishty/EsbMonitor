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
			daysBefore: 0 // get errors just for today
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
