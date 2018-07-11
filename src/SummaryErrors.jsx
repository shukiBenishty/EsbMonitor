// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { createFragmentContainer, graphql} from 'react-relay';
import { connect } from 'react-redux';
import { css } from 'glamor';

const SummaryErrors = ({dispatch, title, totals, relay}) => {

  let todayErrors = 0;
  let percentage = 0;
  if( totals.errors && totals.errors.length > 0 ){
    todayErrors = totals.errors[0].value.toLocaleString();
    percentage = Math.floor(totals.errors[0].value / totals.errors[0].value * 100) ;
  }

  let progressBarWidth =  percentage + '%';
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
                    <Link to='/analyze/error'>
                      <button onClick={ () => {
                                  dispatch({
                                    type: 'PAGE_CHANGED',
                                    data: {
                                      pageId: 4
                                    }
                                  })
                              }}
                        className='btn btn-xs btn-primary'>View</button>
                    </Link>

                  </span>
                </h6>
                <br />
                <p className="fs-28 fw-100">{todayErrors}</p>
                <div className="progress">
                  <div className="progress-bar bg-danger" role="progressbar" className={progressBarCss}>
                  </div>
                </div>
                <div className="text-gray fs-12">
                  <i className="ti-stats-down text-danger mr-1"></i>
                  {percentage}% decrease from last day
                </div>
              </div>
            </div>);

};

export default createFragmentContainer(connect()(SummaryErrors),
graphql`
fragment SummaryErrors_totals on Runtime
@argumentDefinitions(
  before: { type: "Date", defaultValue: 2 }
)
{
  errors(before: $before) {
    date
    value
  }
}
`);
