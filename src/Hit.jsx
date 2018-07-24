// @flow
import React from 'react';
import classNames from 'classnames';
import moment from 'moment';

const Hit = ({source}) => {

    const _status = source.status.toLowerCase();
    const statusClass = classNames('lead mr-25 d-none d-md-block', {
      'infoText': _status == "success",
      'warningText': _status == "warning",
      'errorText': _status == "error"
    });

    const arrowClass = classNames('icon ti-control-forward', {
      'errorText': _status == "error"
    })

    return <div className='media align-items-center bg-white b-1'>
            <div className='flexbox align-items-center flex-grow gap-items'>
              <div className='media-body text-truncate'>
                <h6>{source.service_name}</h6>
                <small>
                  <span>
                  {moment(source.trace_Date).format('DD-MM-YYYY HH:mm:ss')}
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
            <div className={arrowClass}>
            </div>
      </div>
};

export default Hit;
