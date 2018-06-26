// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

type Props = {
  userName: string,
  styles: {}
}

class Header extends React.Component<Props> {

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

  environmentChanged(env) {

    this.props.dispatch({
      type: 'ENVIRONMENT_CHANGED',
      data: {
        environment: env
      }
    });
  }

  render() {
    return (
      <header className="topbar">
        <div className="topbar-left">
          <ul className="topbar-btns">
            <li className="dropdown d-done d-lg-block">
              <span className="topbar-btn has-new" data-toggle="dropdown">
                <i className="ti-bell">
                </i>
              </span>
            </li>
          </ul>
        </div>
        <div className="topbar-right" style={this.styles.container}>
          <div className='dropdown'>
            <a className='btn btn-sm dropdown-toggle'data-toggle="dropdown" href='#'>{this.props.activeEnvironment} environemnt</a>
            <div className='dropdown-menu' x-placement="bottom-start">
              <a className='dropdown-item' onClick={ () => ::this.environmentChanged(this.props.inactiveEnvironment)}>{this.props.inactiveEnvironment} environment</a>
            </div>
          </div>
        </div>
      </header>
    )
  }

};

const mapStateToProps = state => {
  return {
    activeEnvironment: state.activeEnvironment,
    inactiveEnvironment: state.inactiveEnvironment
  }
}

export default connect(mapStateToProps)(Header);
