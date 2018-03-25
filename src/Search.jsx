// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';
import Datetime from 'react-datetime';
import elasticsearch from 'elasticsearch';
import esb from 'elastic-builder';
import elasticClient from '../elastic/connection';

import Hit from './Hit';

type Props = {
  match: {
    url: string
  },
  styles: {},
  _searchField: HTMLInputElement,
  searchText: string
}

type State = {
  fields: [],
  hits: [],
  hitsCount: number,
  fromDate: Date,
  isFromDateInvalid: boolean,
  tillDate: Date,
  isTillDateInvalid: boolean
}

class Search extends React.Component<Props, State> {

  state = {
    fields: [],
    hits: [],
    isFromDateInvalid: false,
    isTillDateInvalid: false
  }

  constructor(props) {

    super(props);

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

  }

  _fromDateChaged(_date: Date) {

    if( !_date ) { // null/empty value

      this.setState({
        fromDate: null,
        isFromDateInvalid: false
      });

      return;
    }

    if( moment(_date).isValid() ) {

      this.setState({
        fromDate: _date.toDate(),
        isFromDateInvalid: false
      });

    } else {
      this.setState({
        isFromDateInvalid: true
      })
    }

  }

  _tillDateChanged(_date: Date) {

    if( !_date ) { // null/empty value

      this.setState({
        tillDate: null,
        isTillDateInvalid: false
      });

      return;
    }

    if( moment(_date).isValid() ) {

      this.setState({
        tillDate: _date.toDate(),
        isTillDateInvalid: false
      });

    } else {

      this.setState({
        isTillDateInvalid: true
      });
    }

  }

  buildRequestBody(_from: Date,
                   _till: Date,
                  searchFields: string[],
                  searchText: string) {

  let tokens = searchText.split('^');
  if( tokens.length > 1 ) {
    let sortField = tokens[1];
    return esb.requestBodySearch()
          .sort(esb.sort(sortField, 'desc'));
  }

  if( !_from && !_till) {

        return esb.requestBodySearch()
        .query(
            esb.multiMatchQuery(searchFields,
                                searchText)
                .lenient(true) // lenient allows to ignore exceptions caused by
                               // data-type mismatches such as trying
                               // to query a numeric field with a text query string
        )
        .sort(esb.sort('trace_Date', 'desc'));

      } else if( _from && _till ) {

        let from = moment(_from).format('YYYY-MM-DDTHH:mm:ssZZ');
        let till = moment(_till).format('YYYY-MM-DDTHH:mm:ssZZ');

        return esb.requestBodySearch()
        .query(
                esb.boolQuery()
                .must(esb.rangeQuery('trace_Date')
                    .gte(from)
                    .lte(till)
              )
              .filter(esb.multiMatchQuery(searchFields,
                            searchText)
                            .lenient(true))
        )
        .sort(esb.sort('trace_Date', 'desc'));

      } else if( _from ) {

          let from = moment(_from).format('YYYY-MM-DDTHH:mm:ssZZ');
          return esb.requestBodySearch()
          .query(
                  esb.boolQuery()
                  .must(esb.rangeQuery('trace_Date')
                      .gte(from)
                )
                .filter(esb.multiMatchQuery(searchFields,
                              searchText)
                              .lenient(true))
          )
          .sort(esb.sort('trace_Date', 'desc'));

      } else if( _till ) {

        let till = moment(_till).format('YYYY-MM-DDTHH:mm:ssZZ');

        return esb.requestBodySearch()
        .query(
                esb.boolQuery()
                .must(esb.rangeQuery('trace_Date')
                    .lte(till)
              )
              .filter(esb.multiMatchQuery(searchFields,
                            searchText)
                            .lenient(true))
        )
        .sort(esb.sort('trace_Date', 'desc'));
      }
  }

  _search() {

    // clean up search results
    this.setState({
      hits: [],
      hitsCount: 0
    })

    if( this.state.isFromDateInvalid || this.state.isTillDateInvalid )
      return;

    let searchText = this._searchField.value.trim();

    const searchFields = [];
    this.state.fields.forEach( field => {
      if( field.isSelected )
        searchFields.push(field.name)
    });

    const requestBody =
      this.buildRequestBody(this.state.fromDate,
                           this.state.tillDate,
                           searchFields,
                           searchText);

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

  toggleField(e: SyntheticEvent<HTMLButtonElement>) {

    let _fields = this.state.fields;
    let index = _.findIndex(_fields, { name: e.target.title } );
    if( index != -1 ) {

      let _field = _fields[index];
      _field.isSelected = e.target.checked;

      _fields.splice(index, 1, _field);

      this.setState({
        fields: _fields
      })

    }
  }

  componentDidMount() {

    if( this.props.match.params.searchText && this.props.match.params.searchText != '∆' ) {
      this.searchText = this.props.match.params.searchText;
    }

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

        if( self.searchText ) {
          self._searchField.value = self.searchText;
          self._search();
        }

      }

    });

  }

  render() {

    let {match} = this.props;

    const hitsCount = this.state.hitsCount > 0 ?
                  <div>Top {this.state.hitsCount} results, sorted by descending issued date.</div> :
                  null;

    let fromDateClassName = classNames('', {
      'inputValidationError': this.state.isFromDateInvalid
    });

    let tillDateClassName = classNames('', {
      'inputValidationError': this.state.isTillDateInvalid
    });

    return (<div className='row'>
                      <div className='col-lg-3 tab-content'>
                          <div className='card card-bordered'>
                            <div className='card-header card-header-sm'>
                              Look up in these fields
                            </div>
                            <ul className='card-body'>
                              {
                                this.state.fields.map( (field, index) => {

                                  let isSelected = field.isSelected;

                                  return <li className='form-check' key={index}>
                                            <label style={this.styles.fieldLabel}>
                                              <input type='checkbox'
                                                     checked={isSelected}
                                                     title={field.name}
                                                     className='form-check-input'
                                                     onChange={::this.toggleField}
                                              />
                                            {field.name}
                                            </label>
                                         </li>
                                })
                              }
                            </ul>
                            <div className='card-footer'>
                              <div className='row'>
                                <div className='col-3'>From
                                </div>
                                <div className='col-9'>
                                  <Datetime className={fromDateClassName}
                                            onChange={::this._fromDateChaged}
                                            closeOnSelect={true}
                                            local='he' />
                                </div>
                              </div>
                              <br />
                              <div className='row'>
                                  <div className='col-3'>Until</div>
                                  <div className='col-9'>
                                    <Datetime className={tillDateClassName}
                                              onChange={::this._tillDateChanged}
                                              closeOnSelect={true}
                                              local='he' />
                                  </div>
                              </div>
                            </div>

                          </div>

                      </div>
                      <div className='col-lg-9'>
                        <div className='flexbox show'>

                          <input style={this.styles.searchBoxStyle}
                            placeholder='Type to search...'
                            onKeyPress={ (e) => {
                              if (e.key === 'Enter') {
                                this._search()
                              }
                            }}
                            type='text'
                            ref={
                              (el) => {
                                this._searchField = el;
                              }
                            }
                          />
                          <button className='btn btn-info btn-default'
                            onClick={::this._search}>Search</button>
                        </div>
                        {hitsCount}
                        <div>

                            {
                              this.state.hits.map( (hit, index) => {
                                return <Link key={index}
                                             storyid={hit._source.message_guid}
                                             to={'/analyze/story/' + hit._source.message_guid}>
                                          <Hit source={hit._source}/>
                                       </Link>

                              })
                            }

                       </div>

                      </div>
                    </div>

           )
  }
}

export default Search;
