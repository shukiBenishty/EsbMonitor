// @flow
import React from 'react';

type Props = {
  userName: string
}

class WelcomeComponent extends React.Component<Props> {

  constructor(props) {
    super(props);

    this.styles = {
      container: {
        display: "flex",
        flexDirection: "row-reverse",
        backgroundColor: '#d3d3d3'
      }

    }
  }

  render() {
    return (
      <div style={this.styles.container}>Welcome, {this.props.userName}</div>
    )
  }

};

export default WelcomeComponent;
