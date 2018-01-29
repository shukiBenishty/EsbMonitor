import React from 'react';
import { Link } from 'react-router-dom';

class Navigation extends React.Component {

  constructor() {
    super();

    this.styles = {
      logoStyle: {
        width: "48px",
        height: "48px"
      }
    }
  }

  render() {
    return (<aside className="sidebar sidebar-expand-lg sidebar-light sidebar-sm sidebar-color-info">
                <header className="sidebar-header bg-info">
                  <span className="logo">ESB Monitor</span>
                  <img style={this.styles.logoStyle}
                        src='./assets/images/reactlogo.png' alt='ESB Monitor Logo' />
                </header>
                <nav className="sidebar-navigation ps-container">
                  <ul className="menu menu-sm">
                     <li className="menu-item active">
                        <Link className="menu-link" to="/">
                          <span className="icon ti-dashboard">
                          </span>
                          <span className="title">Dashboard
                          </span>
                        </Link>
                    </li>
                    <li className="menu-item">
                      <Link className="menu-link" to='/realtime'>
                        <span className="icon ti-layout-list-thumb"></span>
                        <span className="title">Realtime</span>
                      </Link>
                    </li>
                    <li className="menu-item">
                      <Link className="menu-link" to='/stat'>
                        <span className="icon ti-pulse"></span>
                        <span className="title">Stats</span>
                      </Link>
                    </li>
                    <li className="menu-item">
                      <Link className="menu-link" to='/analytics'>
                        <span className="icon ti-layers-alt"></span>
                        <span className="title">Analytics</span>
                        <span className="badge badge-pill badge-info">2</span>
                      </Link>
                    </li>
                    <li className="menu-divider">
                    </li>
                    <li>
                      <Link className='menu-link' to='/admin'>
                        <span className="icon ti-settings"></span>
                        <span className="title">Admin</span>
                      </Link>
                    </li>
                    <li>
                      <Link className='menu-link' to='/test'>
                        <span className="icon ti-help"></span>
                        <span className="title">Test</span>
                      </Link>
                    </li>
                  </ul>
                </nav>
            </aside>);
  }

};

export default Navigation;
