// @flow
import React from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { createFragmentContainer, graphql} from 'react-relay';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import { Row, Col, Nav } from 'reactstrap';
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

    return (<div className='sidebar' data-color='blue'>
              <div className="logo">
                  <a href='#' style={this.styles.logoStyle} className='simple-text logo-mini'>
                     <div className='logo-img'>
                        <img src='./assets/images/logo-white.svg' alt='ESB Monitor Logo' />
                     </div>
                  </a>
                  <a href='#' className='simple-text logo-normal'>
                    ESB Now
                  </a>
              </div>
              <div className='sidebar-wrapper' ref='sidebar'>
                <Nav className="sidebar-navigation ps-container">
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
                                    <NavLink className="nav-link"
                                      onClick={ () => this.pageIdChanged(index+1) }
                                      to={link.to}>
                                        <i className={"now-ui-icons " + link.icon}></i>
                                        <Row>
                                          <Col md='9'>{link.title}</Col>
                                          <Col md='3'>{badge}</Col>
                                        </Row>

                                    </NavLink>
                                 </li>)
                        }
                    })
                  }
                </Nav>
              </div>
            </div>);
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
