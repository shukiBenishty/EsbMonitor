// @flow
import React from 'react';
import { withRouter } from 'react-router-dom'
import moment from 'moment';
import classNames from 'classnames';
import { Chart } from 'react-google-charts';

type Props = {
  data: Object
}

class EsbEvent extends React.Component<Props> {

  styles: {};

  constructor(props) {

    super(props);

    this.styles = {
      esbBox: {
        backgroundColor: '#fff',
        border: '1px',
        borderColor: 'rgb(235, 235, 235)',
        borderStyle: 'solid',
        justifyContent: 'flex-start',
        cursor: "pointer"
      }

    }
  }

  rowSelected(row) {
    this.props.history.push(`/analyze/story/${this.props.data.storyId}`);
  }

  render() {

    let issued = moment(this.props.data.issued).format('DD/MM/YYYY HH:mm:ss');

    var statusClass = classNames('divider-dash', {
      'infoText': this.props.data.status == "INFO",
      'warningText': this.props.data.status == "WARNING",
      'errorText': this.props.data.status == "ERROR"
    });

    return (<div style={this.styles.esbBox}  className="media align-items-center"
                onClick={::this.rowSelected}>
                <a className="flexbox align-items-center flex-grow gap-items text-truncate">
                  <div className="media-body text-truncate">
                    <h6>{this.props.data.serviceName}</h6>
                    <small>
                      <span>{this.props.data.storyId}</span>
                      <span className="divider-dash">{issued}</span>
                      <span className={statusClass}>{this.props.data.status}</span>
                    </small>
                  </div>
                  <span className="lead text-fade">{this.props.data.message}</span>
                </a>
            </div>);

  }

};

export default withRouter(EsbEvent);
