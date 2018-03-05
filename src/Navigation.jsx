// @flow
import React from 'react';
import { createFragmentContainer, graphql} from 'react-relay';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import navigationLinks from './NavigationLinks.json'

type State = {
  currentLink: number
}

class Navigation extends React.Component<{}, State> {

  state = {
    currentLink: 1
  }

  constructor(props) {
    super(props);

    this.styles = {
      logoStyle: {
        width: "48px",
        height: "48px"
      },
      navDivider: {
        marginTop: "1px"
      }
    }
  }

  linkClicked = (linkNumber: number) => {
    this.setState({
      currentLink: linkNumber
    })
  }

  render() {

    let _totalErrors = ( this.props.totals.errors ) ?
                this.props.totals.errors : [{value:0}];

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
                          if( link.badge && _totalErrors.length > 0 ) {
                            let badgeClasName = 'badge badge-pill ' + link.badge.type;
                            badge = <span className={badgeClasName}>{_totalErrors[0].value}</span>
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

export default createFragmentContainer(Navigation,
graphql`
fragment Navigation_totals on Runtime
@argumentDefinitions(
  before: { type: "Date", defaultValue: 2 }
)
{
  errors(before: $before) {
    date
    value
  }
}
`);
