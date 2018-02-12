// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import classNames from 'classnames';

import navigationLinks from './NavigationLinks.json'

class Navigation extends React.Component {

  constructor() {
    super();

    this.styles = {
      logoStyle: {
        width: "48px",
        height: "48px"
      },
      navDivider: {
        marginTop: "1px"
      }
    }

    this.state = {
      currentLink: 1,
      errorsNumber: 0
    }

    this.linkClicked = this.linkClicked.bind(this);
  }

  linkClicked(linkNumber: number) {
    this.setState({
      currentLink: linkNumber
    })
  }

  componentWillReceiveProps(nextProps) {

    this.setState({
        errorsNumber: ++this.state.errorsNumber
    })

  }

  render() {
    return (<aside className="sidebar sidebar-expand-lg sidebar-light sidebar-sm sidebar-color-info">
                <header className="sidebar-header bg-info">
                  <span className="logo">ESB Monitor</span>
                  <img style={this.styles.logoStyle}
                        src='./assets/images/reactlogo.png' alt='ESB Monitor Logo' />
                </header>
                <nav style={this.styles.navDivider} className="sidebar-navigation ps-container">
                  <ul className="menu menu-sm">
                  {
                    navigationLinks.map( (link, index) => {

                        let linkClassName = classNames('menu-item', {
                          'active': link.id == this.state.currentLink
                        })

                        if( link.type == 'menu-divider' ) {
                            linkClassName = link.type;
                            return (<li key={index} className={linkClassName} />)
                        } else {

                          let badge = null;
                          if( link.badge && this.state.errorsNumber > 0 ) {
                            let badgeClasName = 'badge badge-pill ' + link.badge.type;
                            badge = <span className={badgeClasName}>{this.state.errorsNumber}</span>
                          }

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

function mapStateToProps(state) {

  if( state.status == 'ERROR' ) {
    return {
        status: state.status
    }
  } else
      return {};
}

export default connect(mapStateToProps)(Navigation);
