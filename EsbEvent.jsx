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

    var statusClass = classNames({
      'infoText': this.props.data.status == "INFO",
      'warningText': this.props.data.status == "WARNING",
      'errorText': this.props.data.status == "ERROR"
    });

    return (<div style={this.styles.container}>
              <div style={this.styles.esbFirstField}>{this.props.data.storyId}</div>
              <div style={this.styles.esbField} className={statusClass}>{this.props.data.status}</div>
              <div style={this.styles.esbLongField}>{issued}</div>
              <div style={this.styles.esbField}>{this.props.data.eventId}</div>
            </div>);
  }

};

export default EsbEvent;
