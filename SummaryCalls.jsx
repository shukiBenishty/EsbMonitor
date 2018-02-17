// @flow
import React from 'react';
import { createFragmentContainer, graphql} from 'react-relay';
import { css } from 'glamor';

const SummaryCalls = ({title, totals, relay}) => {

    let totalCalls = totals;

    let progressBarWidth = "10%";

    let progressBarCss = css({
        width: progressBarWidth,
        height: "4px",
        backgroundColor: "#33cabb"
    });


    return (<div className="col-lg-4">
              <div className="card card-body esbCard">
              <h6>
                <span className="text-uppercase esbCaption">{title}</span>
                <span className="float-right">
                  <a className="btn btn-xs btn-primary" href="#">View</a>
                </span>
              </h6>
              <br />
              <p className="fs-28 fw-100">17.876</p>
              <div className="progress">
                <div className="progress-bar" role="progressbar" className={progressBarCss}>
                </div>
              </div>
              <div className="text-gray fs-12">
                <i className="ti-stats-up text-success mr-1" aria-hidden="true"></i>%18 decrease from last day
              </div>
            </div>
          </div>);


}

export default createFragmentContainer(SummaryCalls,
graphql`
  fragment SummaryCalls_totals on Runtime
  @argumentDefinitions(
    before: { type: "Date", defaultValue: 2 }
  )
  {
    totalCalls(before: $before) {
      date
      value
    }
  }
`);
