// @flow
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { CSSTransitionGroup } from 'react-transition-group'
import elasticsearch from 'elasticsearch';
import esb from 'elastic-builder';
import classNames from 'classnames';
import moment from 'moment';
import elasticClient from '../elastic/connection';
import Datetime from 'react-datetime';
import Story from './Story';

import Hit from './Hit';

class Analyze extends React.Component {

  constructor() {

    super();

    this.styles = {
      searchBoxStyle: {
        flexGrow: '16'
      },
      searchButtonStyle: {
        flexGrow: '1'
      },
      fieldsSelector: {
        flexGrow: '1'
      },
      fieldLabel: {
        fontWeight: '300',
        fontSize: '13px'
      },
      selfAligned: {
        alignSelf: 'center'
      },
      autoMargin: {
        marginBottom: 'auto'
      },
      rigthAligned: {
        marginLeft: 'auto'
      }
    }

    this.state = {
      showSearchPanel: true,
      fields: [],
      hits: [],
      hitsCount: 0,
      fromDate: null,
      tillDate: null
    }

    this._search = this._search.bind(this);
    this.toggleField = this.toggleField.bind(this);
    this.swapPanels = this.swapPanels.bind(this);

    this._fromDateChanged = this._fromDateChanged.bind(this);
    this._tillDateChanged = this._tillDateChanged.bind(this);
  }

  _fromDateChanged(_date) {

    this.setState({
      fromDate: _date.toDate()
    })
  }

  _tillDateChanged(_date) {

    this.setState({
      tillDate: _date.toDate()
    })
  }

  componentDidMount() {

    const searchAllowedFields = ['ip', 'keyword', 'text'];
    const self = this;

    elasticClient.indices.getMapping({
      index: 'esb_ppr_summary',
      type: 'summary',
    },  (error,response) => {

      if( error ) {
        console.error('GetMappings error: ' + error);
      } else {

          let _fields = [];

          const esProps = {...response.esb_ppr_summary.mappings.summary.properties};

          for(let esPropName in esProps) {

            if( esProps.hasOwnProperty(esPropName) ) {
              const _prop = esProps[esPropName];

              if( esPropName === 'service_name' ) { // Temporary solution => change mapping or search query
                _fields.push({
                               name: esPropName,
                               isSelected: false
                              });
              } else {

                if( _.includes(searchAllowedFields, _prop.type ) ) {
                  _fields.push({
                                 name: esPropName,
                                 isSelected: true
                                });
                }
             }
            }
          }

          self.setState({
            fields: _fields
          })
      }

    });
  }

  _search() {

    let _from = moment(this.state.fromDate).format('YYYY-MM-DDTHH:mm:ss');
    let _till = moment(this.state.tillDate).format('YYYY-MM-DDTHH:mm:ss');

    // clean up previous search results
    this.setState({
      hits: [],
      hitsCount: 0
    })

    let searchText = this._searchField.value.trim();

    let before = 7;
    let from = `now-${before}d/d`;

    const searchFields = [];
    this.state.fields. forEach( field => {
      if( field.isSelected )
        searchFields.push(field.name)
    });

    const requestBody = esb.requestBodySearch()
    // .query(
    //         esb.boolQuery()
    //         .must(esb.rangeQuery('trace_Date')
    //             .gte(_from)
    //             .lte(_till)
    //       )
    //       .filter(esb.multiMatchQuery(searchFields,
    //                     searchText)
    //                     .lenient(true))
    // )
    // .sort(esb.sort('trace_Date', 'desc'));;

    .query(
        esb.multiMatchQuery(searchFields,
                            searchText)
            .lenient(true) // lenient allows to ignore exceptions caused by
                           // data-type mismatches such as trying
                           // to query a numeric field with a text query string
    )
    .sort(esb.sort('trace_Date', 'desc'));

    return elasticClient.search({
        index: 'esb_ppr_summary',
        type: 'summary',
        body: requestBody.toJSON()
    }).then( response => {

      this.setState({
        hits: response.hits.hits,
        hitsCount: response.hits.hits.length
      })

    }).catch( error => {
      console.error(error);
    });

  }

  swapPanels(showSearchPanel: boolean) {

    this.setState({
      showSearchPanel: showSearchPanel
    })

  }

  toggleField(e){

    let _fields = this.state.fields;
    let index = _.findIndex(_fields, {name: e.target.title} );
    if( index != -1 ){
      let _field = _fields[index];
      _field.isSelected = e.target.checked;

      _fields.splice(index, 1, _field);

      this.setState({
        fields: _fields
      })

    }
  }

  render() {

    const searchPanelClass = classNames('tab-pane fade in', {
      'show': this.state.showSearchPanel,
      'active': this.state.showSearchPanel
    });
    const flowPanelClass = classNames('tab-pane fade in', {
      'show': !this.state.showSearchPanel,
      'active': !this.state.showSearchPanel
    });

    const hitsCount = this.state.hitsCount > 0 ?
                      <div>Top {this.state.hitsCount} results, sorted by descending issued date</div> :
                      null;

    return(<main className="main-container">
              <div className="main-content">
                <div className='tab-content'>
                    <div className={searchPanelClass} id="tab1">
                      <div className='row'>
                        <div className='col-lg-3 tab-content'>
                          <div className='card card-bordered' >
                            <div className='card-header card-header-sm'>Look-up in these fields:</div>
                            <ul  style={this.styles.autoMargin} className='card-body'>
                              {
                                this.state.fields.map( (field, index) => {

                                    let isSelected = field.isSelected;

                                    return <li className='form-check' key={index}>
                                              <label style={this.styles.fieldLabel}>
                                                  <input type="checkbox"
                                                        checked={isSelected}
                                                        title={field.name}
                                                        className="form-check-input"
                                                        onChange={this.toggleField}
                                                  />
                                              {field.name}
                                              </label>
                                           </li>
                                })
                              }

                            </ul>
                            <div className='card-footer'>
                              <div className='row'>
                                <div style={this.styles.selfAligned} className='col-3'>From</div>
                                <div className='col-9'>
                                  <Datetime
                                      onChange={this._fromDateChanged}
                                      closeOnSelect={true}
                                      locale="he"/>
                                </div>
                              </div>
                              <br />
                              <div className='row'>
                                <div style={this.styles.selfAligned} className='col-3'>Until</div>
                                <div className='col-9'>
                                  <Datetime
                                      onChange={this._tillDateChanged}
                                      closeOnSelect={true}
                                      locale="he"/>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='col-lg-9'>
                          <div className='flexbox tab-pane fade in active show'>
                              <input
                                 style={this.styles.searchBoxStyle}
                                 placeholder='Type to search...'
                                 type='text'
                                 ref={
                                   (el) => {
                                       this._searchField = el;
                                   }
                              } />
                              <button style={this.styles.searchButtonStyle}
                                className="btn btn-info"
                                onClick={this._search}>Search</button>
                            </div>
                            {hitsCount}
                            <div>
                              <CSSTransitionGroup
                                  transitionAppear={true}
                                  transitionName="example"
                                  transitionAppearTimeout={500}
                                  transitionEnterTimeout={500}
                                  transitionLeaveTimeout={300}>
                              {
                                this.state.hits.map( (hit, index) => {
                                  return <Hit swapper={this.swapPanels}
                                              source={hit._source} key={index} />
                                })
                              }
                            </CSSTransitionGroup>
                            </div>
                        </div>
                      </div>
                    </div>

                    <div className={flowPanelClass} id="tab2">
                        <div className='flexbox'>
                          <button style={this.styles.rigthAligned} className="btn btn-info"
                            onClick={ () => this.swapPanels(true) }>
                            Back to search
                          </button>
                        </div>

                        <Story swapper={this.swapPanels}
                        />
                     </div>

                </div>

              </div>
            </main>);
  }

};

export default Analyze;
