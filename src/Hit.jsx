// @flow
import React from 'react';
import classNames from 'classnames';
import moment from 'moment';

const Hit = ({source}) => {

    const statusClass = classNames('lead text-fade mr-25 d-none d-md-block', {
      'infoText': source.status == "Success",
      'warningText': source.status == "Warning",
      'errorText': source.status == "Failure"
    });

    return <div className='media align-items-center bg-white b-1'>
            <div className='flexbox align-items-center flex-grow gap-items'>
              <div className='media-body text-truncate'>
                <h6>{source.service_name}</h6>
                <small>
                  <span>
                  {moment(source.trace_Date).format('DD-MM-YYYY hh:mm:ss')}
                  </span>
                  <span className='divider-dash'>
                  {source.client_ip}
                  </span>
                  <span className='divider-dash'>
                  {source.client_user}
                  </span>
                </small>
              </div>
            </div>
            <span className={statusClass}>
              {source.status}
            </span>
            <div className='icon ti-control-forward'>
            </div>
      </div>
};

export default Hit;
