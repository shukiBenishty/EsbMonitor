import React from 'react';
import { Link } from 'react-router-dom';

class Navigation extends React.Component {

  render() {
    return (<aside className="sidebar sidebar-expand-lg sidebar-light sidebar-sm sidebar-color-info">
                <header className="sidebar-header bg-info">
                  <span className="logo">ESB Monitor</span>
                  <span className="idebar-toggle-fold"></span>
                </header>
                <nav className="sidebar-navigation ps-container">
                  <ul className="menu menu-sm">
                     <li className="menu-item">
                        <Link className="menu-link" to="/">
                          <span className="icon ti-home">
                          </span>
                          <span className="title">Dashboard
                          </span>
                        </Link>
                    </li>
                    <li className="menu-item">
                      <Link className="menu-link" to='/realtime'>
                        <span className="icon ti-view-list">
                        </span>
                        <span className="title">Realtime
                        </span>
                      </Link>
                    </li>
                    <li className="menu-item">
                      <Link className="menu-link" to='/stat'>
                        <span className="icon ti-pulse">
                        </span>
                        <span className="title">Stats
                        </span>
                      </Link>
                    </li>
                    <li className="menu-item">
                      <Link className="menu-link" to='/analytics'>
                        <span className="icon ti-layers-alt">
                        </span>
                        <span className="title">Analytics
                        </span>
                      </Link>
                    </li>
                  </ul>
                </nav>
            </aside>);
  }

};

export default Navigation;
