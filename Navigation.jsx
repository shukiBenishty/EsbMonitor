// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

const links = [{
  id: 1,
  type: 'menu-item',
  to: '/',
  title: 'Dashboard',
  icon: 'icon ti-dashboard',
  badge: null
}, {
  id: 2,
  type: 'menu-item',
  to: '/realtime',
  title: 'Realtime',
  icon: 'icon ti-layout-list-thumb',
  badge: { count: 3, type: 'badge-danger'}
}, {
  id: 3,
  type: 'menu-item',
  to: '/stat',
  title: 'Stats',
  icon: 'icon ti-pulse',
  badge: null
}, {
  id: 4,
  type: 'menu-item',
  to: '/analytics',
  title: 'Analytics',
  icon: 'icon ti-layers-alt',
  badge: null
}, {
  id: 5,
  type: 'menu-divider'
}, {
  id: 6,
  type: 'menu-item',
  to: '/admin',
  title: 'Admin',
  icon: 'icon ti-settings',
  badge: null
}
]

class Navigation extends React.Component {

  constructor() {
    super();

    this.styles = {
      logoStyle: {
        width: "48px",
        height: "48px"
      }
    }

    this.state = {
      currentLink: 1
    }

    this.linkClicked = this.linkClicked.bind(this);
  }

  linkClicked(linkNumber: number) {
    this.setState({
      currentLink: linkNumber
    })
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
                  {
                    links.map( (link, index) => {

                        let linkClassName = classNames('menu-item', {
                          'active': link.id == this.state.currentLink
                        })

                        if( link.type == 'menu-divider' ) {
                            linkClassName = link.type;
                            return (<li key={index} className={linkClassName} />)
                        } else {

                          let badge = ( link.badge ) ?
                            <span className="badge badge-pill badge-danger">3</span> :
                            null;

                          return (<li key={index} className={linkClassName}>
                                    <Link className="menu-link"
                                      onClick={ () => this.linkClicked(index+1) }
                                      to={link.to}>
                                        <span className={link.icon}></span>
                                        <span className="title">{link.title}</span>
                                        {badge}
                                    </Link>
                                 </li>)
                        }
                    })
                  }
                  </ul>

                </nav>
            </aside>);
  }

};

export default Navigation;
