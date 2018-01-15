// @flow
import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  userName: string
}

class WelcomeComponent extends React.Component<Props> {

  constructor(props) {
    super(props);

    this.styles = {

      navigation: {
        height: "12%"
      },
      container: {
        display: "flex",
        flexDirection: "row-reverse",
        backgroundColor: '#d3d3d3'
      }
    }
  }

  render() {
    return (
      <header className="topbar">
        <div style={this.styles.container}>Welcome, {this.props.userName}</div>
      </header>
    )
  }

};

export default WelcomeComponent;
