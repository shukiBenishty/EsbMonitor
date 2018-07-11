// @flow
import React from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { createFragmentContainer, graphql} from 'react-relay';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import navigationLinks from './NavigationLinks.json'

type Props = {
  pageId: number
}

class Navigation extends React.Component<Props> {

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

  pageIdChanged = (pageId: number) => {

    this.props.dispatch({
      type: 'PAGE_CHANGED',
      data: {
        pageId: pageId
      }
    })
  }

  render() {

    // const tokens = this.props.history.location.pathname.split('/');
    // if( tokens.length > 1 ) {
    //   ::this.getPageId(tokens[1]);
    // }

    let _totalErrors = ( this.props.totals.errors ) ?
                this.props.totals.errors : [{value:0}];

    const self = this;

    return (<aside className="sidebar sidebar-expand-lg sidebar-light sidebar-sm sidebar-color-info">
                <header className="sidebar-header bg-info">
                  <span className="logo">ESB Monitor</span>
                  <img style={this.styles.logoStyle}
                        src='./assets/images/logo-white.svg' alt='ESB Monitor Logo' />
                </header>
                <nav style={this.styles.navDivider} className="sidebar-navigation ps-container">
                  <ul className="menu menu-sm">
                  {

                    navigationLinks.map( (link, index) => {

                        let linkClassName = classNames('menu-item', {
                          'active': link.id == self.props.pageId
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
                                      onClick={ () => this.pageIdChanged(index+1) }
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
  return {
      pageId: state.pageId
  }
}

export default createFragmentContainer(connect(mapStateToProps)(withRouter(Navigation)),
graphql`
fragment Navigation_totals on Runtime
@argumentDefinitions(
  before: { type: "Date", defaultValue: 0 }
)
{
  errors(before: $before) {
    date
    value
  }
}
`);
