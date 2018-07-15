// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { createFragmentContainer, graphql} from 'react-relay';
import { connect } from 'react-redux';
import { css } from 'glamor';
import DocumentTitle from 'react-document-title';

const SummaryCalls = ({dispatch, title, totals, relay}) => {

    let todayCalls = 0;
    let percentage = 0;
    if( totals.totalCalls && totals.totalCalls.length > 0 ){
      todayCalls = totals.totalCalls[0].value.toLocaleString();
      percentage = Math.floor(totals.totalCalls[0].value / totals.totalCalls[0].value * 100) ;
    }

    let progressBarWidth = percentage + '%';
    let progressBarCss = css({
        width: progressBarWidth,
        height: "4px",
        backgroundColor: "#33cabb"
    });

    return (<DocumentTitle title='Dashboard - ESB Monitor'>
            <div className="col-lg-4">
              <div className="card card-body esbCard">
              <h6>
                <span className="text-uppercase esbCaption">{title}</span>
                <span className="float-right">
                  <Link to='/analyze/∑'>
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
              <p className="fs-28 fw-100">{todayCalls}</p>
              <div className="progress">
                <div className="progress-bar" role="progressbar" className={progressBarCss}>
                </div>
              </div>
              <div className="text-gray fs-12">
                <i className="ti-stats-up text-success mr-1" aria-hidden="true"></i>
                {percentage}% increase from last day
              </div>
            </div>
          </div>
        </DocumentTitle>);


}

export default createFragmentContainer(connect()(SummaryCalls),
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
