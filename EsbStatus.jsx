import React from 'react';

class EsbStatus extends React.Component {

  constructor(props) {

    super(props);

    this.styles = {
      container: {
        display: "flex",
        flexDirection: "row",
        backgroundColor: '#d3d3d3'
      },
    }

  }
  render() {

    let filterValue = ( this.props.filter ) ? this.props.filter : "none";

    return (
      <div style={this.styles.container}>
        <label>Filtered: </label>
        <div>{filterValue}</div>
      </div>
    )
  }

};

export default EsbStatus;
