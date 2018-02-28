import React from 'react';
import elasticsearch from 'elasticsearch';
import esb from 'elastic-builder';
import elasticClient from './elastic/connection';
import TextField from 'material-ui/TextField';

class Analyze extends React.Component {

  constructor() {

    super();

    this.styles = {
      searchBoxStyle: {
        flexGrow: '16',
        height: '38px'
      },
      searchButtonStyle: {
        flexGrow: '1',
      }
    }

    this._search = this._search.bind(this);
  }

  _search() {

    console.log(this._searchField.value);

    let before = 7;
    let from = `now-${before}d/d`;

    const requestBody = esb.requestBodySearch()
    .query(
      esb.rangeQuery('trace_Date')
            .gte(from)
            .lte('now+1d/d')
    )
    .agg(
        esb.dateHistogramAggregation('histogram', 'trace_Date', 'day')
        .order('_key', "desc")
    );

    return elasticClient.search({
        index: 'esb_ppr',
        type: 'correlate_msg',
        _source: ["trace_Date", "message_guid"],
        "size": 0, // omit hits from putput
        body: requestBody.toJSON()
    }).then( response => {
      console.log(response);
    }).catch( error => {
      console.error(error);
    });

  }

  componentDidMount() {

  }

  render() {
    return(<main className="main-container">
              <div className="main-content">
                <header
                      className="flexbox align-items-center media-list-header bg-transparent b-0 py-16">
                      <input
                        style={this.styles.searchBoxStyle}
                         type='text'
                         ref={
                           (el) => {
                               this._searchField = el;
                           }
                      } />
                      <button style={this.styles.searchButtonStyle}
                        className="btn btn-info"
                        onClick={this._search}>Search</button>
                </header>
              </div>
            </main>);
  }

};

export default Analyze;
