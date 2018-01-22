// @flow
import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  userName: string,
  styles: {}
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
      }
    }
  }

  render() {
    return (
      <header className="topbar">
        <div className="topbar-left"></div>
        <div className="topbar-right" style={this.styles.container}>Welcome, {this.props.userName}</div>
      </header>
    )
  }

};

export default WelcomeComponent;
