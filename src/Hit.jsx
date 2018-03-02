// @flow
import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';

class Hit extends React.Component {

  constructor(props) {
    super(props);

    this._displayStory = this._displayStory.bind(this);
  }

  _displayStory(storyId) {
    console.log(storyId);

    this.props.dispatch({
      type: 'STORY_ID',
      data: storyId
    });

    this.props.swapper(false);
  }

  render() {

    const statusClass = classNames('lead text-fade mr-25 d-none d-md-block', {
      'infoText': this.props.source.status == "INFO",
      'warningText': this.props.source.status == "WARNING",
      'errorText': this.props.source.status == "ERROR"
    });

    return <div className='media align-items-center bg-white b-1'>
            <a className='flexbox align-items-center flex-grow gap-items'>
              <div className='media-body text-truncate'>
                <h6>{this.props.source.service_name}</h6>
                <small>
                  <span>
                  {moment(this.props.source.trace_Date).format('DD-MM-YYYY hh:mm:ss')}
                  </span>
                  <span className='divider-dash'>
                  {this.props.source.client_ip}
                  </span>
                  <span className='divider-dash'>
                  {this.props.source.client_user}
                  </span>
                </small>
              </div>
            </a>
            <span className={statusClass}>
              {this.props.source.status}
            </span>
            <div className='icon ti-control-forward'
              onClick={ () => this._displayStory(this.props.source.message_guid) }>
            </div>
      </div>
  }

}

export default connect()(Hit);
