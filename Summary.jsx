// @flow
import React from 'react';
import { createFragmentContainer, graphql} from 'react-relay';

class Summary extends React.Component {

  render() {
    return (<div className="card card-body esbCard">
              <h6>
                <span className="text-uppercase esbCaption">Total calls</span>
                <span className="float-right">
                  <a className="btn btn-xs btn-primary" href="#">View</a>
                </span>
              </h6>
            </div>);
  }

}

export default createFragmentContainer(Summary,
graphql`
  fragment Summary_item on Runtime {
    totalCalls(when: 1) {
      date
      value
    }
  }
`);
