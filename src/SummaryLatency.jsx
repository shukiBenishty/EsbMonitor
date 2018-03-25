import React from 'react';
import { Link } from 'react-router-dom';
import { createFragmentContainer, graphql} from 'react-relay';
import { css } from 'glamor';

const SummaryLatency = ({title, totals, relay}) => {

  let todayLatency = 0;
  let percentage = 0;

  if( totals.latency && totals.latency.length > 0 && totals.todayLatency.length > 0 ){
    todayLatency = totals.todayLatency[0].value.toLocaleString();
    percentage = Math.floor(totals.todayLatency[0].value / totals.latency[0].value * 100) ;
  }

  let progressBarWidth = percentage + '3%';
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
                    <Link to='/analyze/^Latency'>
                      <button className='btn btn-xs btn-primary'>View</button>
                    </Link>
                  </span>
                </h6>
                <br />
                <p className="fs-28 fw-100">{todayLatency} ms.</p>
                <div className="progress">
                  <div className="progress-bar bg-danger" role="progressbar" className={progressBarCss}>
                  </div>
                </div>
                <div className="text-gray fs-12">
                  <i className="ti-stats-down text-danger mr-1"></i>
                  {percentage}% decrease from last hour
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
    todayLatency: latency(before:0) {
      value
    }
    latency(before: $before) {
      date
      value
    }
  }
`);
