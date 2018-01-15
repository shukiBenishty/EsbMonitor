// @flow
import React from 'react';
import moment from 'moment';
import classNames from 'classnames';

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
        justifyContent: 'flex-start'
      },
      container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start"
      },
      esbLongField: {
        flexGrow: "2",
        flexBasis: "200px",
        border: "red",
        borderStyle: "dotted",
        marginLeft: "10px"
      },
      esbFirstField: {
        flexGrow: "1",
        flexBasis: "120px",
        border: "black",
        borderStyle: "dashed",
        marginLeft: "10px"
      },
      esbField: {
        flexGrow: "1",
        flexBasis: "100px",
        border: "black",
        borderStyle: "dashed",
        marginLeft: "10px"
      },
    }
  }

  render() {

    let issued = moment(this.props.data.issued).format('DD/MM/YYYY HH:mm:ss');

    let _combinedStyle = [...this.styles.esbFirstField, {marginLeft: "10px"}];

    var statusClass = classNames('divider-dash', {
      'infoText': this.props.data.status == "INFO",
      'warningText': this.props.data.status == "WARNING",
      'errorText': this.props.data.status == "ERROR"
    });

    return (<div style={this.styles.esbBox} className="media align-items-center">
      <a className="flexbox align-items-center flex-grow gap-items text-truncate">
        <div className="media-body text-truncate">
          <h6>{this.props.data.serviceName}</h6>
          <small>
            <span>{this.props.data.storyId}</span>
            <span className="divider-dash">{issued}</span>
            <span className={statusClass}>{this.props.data.status}</span>
          </small>
        </div>
          <span class="lead text-fade">{this.props.data.message}</span>
      </a>
    </div>);

    // return (<div style={this.styles.container}>
    //           <div style={this.styles.esbFirstField}>{this.props.data.storyId}</div>
    //           <div style={this.styles.esbField} className={statusClass}>{this.props.data.status}</div>
    //           <div style={this.styles.esbLongField}>{issued}</div>
    //           <div style={this.styles.esbField}>{this.props.data.eventId}</div>
    //         </div>);
  }

};

export default EsbEvent;
