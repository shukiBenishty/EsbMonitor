import React from 'react';
import { createFragmentContainer, graphql} from 'react-relay';
import { css } from 'glamor';

const SummaryLatency = ({title}) => {

  let progressBarWidth = "3%";

  let progressBarCss = css({
      width: progressBarWidth,
      height: "4px",
      backgroundColor: "#f96868 !important"
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
                <p className="fs-28 fw-100">0.13 sec.</p>
                <div className="progress">
                  <div className="progress-bar bg-danger" role="progressbar" className={progressBarCss}>
                  </div>
                </div>
                <div className="text-gray fs-12">
                  <i className="ti-stats-down text-danger mr-1"></i>%18 decrease from last hour
                </div>
              </div>
            </div>);

}

export default createFragmentContainer(SummaryLatency,
graphql`
  fragment SummaryLatency_totals on Runtime
  @argumentDefinitions(
    before: { type: "Date", defaultValue: 2 }
  )
  {
    latency(before: $before) {
      date
      value
      id
    }
  }
`);
