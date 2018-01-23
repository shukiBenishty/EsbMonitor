// @flow
import React from 'react';
import { connect } from 'react-redux'
import { QueryRenderer, graphql } from 'react-relay';
import { fetchQuery } from 'relay-runtime';
import moment from 'moment';
import _ from 'lodash';
import 'moment/locale/he';
import classNames from 'classnames';
import Datetime from 'react-datetime';
import { Chart } from 'react-google-charts';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import environment from './Environment';

type Props = {

};

type State = {
  fromDate: {},
  tillDate: {},
  renderChart: boolean,
  serviceSelectorDisabled: boolean,
  selectedCategory: Object
};

const categoriesQuery = graphql`
  query StatsCategoriesQuery {
    categories {
      name
      id
    }
  }
`;

class Stats extends React.Component<Props, State> {

  constructor() {
    super();

    this.state = {
      fromDate: null,
      tillDate: null,
      services: [],
      selectedServices: null,
      serviceSelectorDisabled: true,
      renderChart: false,
      //categories: [],
      selectedCategory: {}
    }

    this.styles = {
      selectionHeader: {
        flexWrap: "wrap"
      }
    }

    this._apply = this._apply.bind(this);
    this._updateCategory = this._updateCategory.bind(this);
    this._fromDateChanged = this._fromDateChanged.bind(this);
    this._tillDateChanged = this._tillDateChanged.bind(this);
    this._serviceNameChanged = this._serviceNameChanged.bind(this);
    this.renderCategories = this.renderCategories.bind(this);
  }

  _apply() {
    console.log(this.state.fromDate + ' ' + this.state.tillDate);
    console.log('Apply');

    this.setState({
      renderChart: true
    })
  }

  _updateCategory(newCategory) {

    let disableCategoriesSelector = !newCategory ? true : false;

    this.setState({
      selectedCategory: newCategory,
      serviceSelectorDisabled: disableCategoriesSelector,
      selectedServices: ''
    });

    let variables = {
      "categoryId": newCategory.value
    }

    fetchQuery(environment,
    graphql`
      query Stats_ServicesByCategory_Query($categoryId: Int) {
        services(categoryId: $categoryId) {
          name
          id
        }
      }
    `,
    variables).then( (data) => {

      this.setState({
        services: data.services.map( (service) => {
                                          return {
                                            value: service.id,
                                            label: service.name
                                          }
                                      })
      })

    })

    // Mock
    // let promise = EsbAPI.getServicesByCategoryId(newCategory.value);
    // promise.then( _services => {
    //   this.setState({
    //     services: _services
    //   })
    // })

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

  _serviceNameChanged(selectedServices) {

    this.setState({ selectedServices });
    console.log(`Selected: ${selectedServices}`);
  }

  // shouldComponentUpdate() {
  //   // prevent rendering after dates changes
  //   return false;
  // }

  async componentDidMount() {
    // const res = await fetch('http://esb01node01/ESBUddiApplication/api/Categories');
    // let _categories = await res.json();
    // let _cats = _categories.map( (category, index) => {
    //   return {
    //       value: category.CategoryId,
    //       label: category.CategoryName
    //     }
    // });
    // this.setState({
    //   categories: _cats
    // });

    // Mock
    // let promise = EsbAPI.getAllCategories();
    // promise.then( _categories => {
    //   this.setState({
    //     categories: _categories
    //   })
    // })

  };

  renderCategories({error, props, retry}) {
    if( error )
      return <div>Error</div>;

    if( !props ) {
      return <div>Loading...</div>
    }

    let normalizedCategories = props.categories.map( (category, index) => {
        return {
          value: category.id,
          label: category.name
        }
    })

    this.props.dispatch({
      type: 'CATEGORIES_RECEIVED',
      data: normalizedCategories
    })

    return null; // This null actually is React element to rendered
  }

  render() {

    let services = [
                    { value: 'one', label: 'One000000000000' },
                    { value: 'two', label: 'Two' }
                  ];
    const { selectedServices } = this.state;
    const value = selectedServices;// && selectedOption.value;

    let chartColumns = [
      {"id":"Stage","type":"string"},
      {"id":"Start","type":"date"},
      {"id":"End","type":"date"}
    ];

    let chartRows = [
      ["Pre-processing",new Date("2018-01-17T22:00:01.000Z"), new Date("2018-01-17T22:00:01.050Z")],
      ["Cross-domain",  new Date("2018-01-17T22:00:01.050Z"), new Date("2018-01-17T22:00:03.000Z")],
      ["Post-processing", new Date("2018-01-17T22:00:03.000Z"), new Date("2018-01-17T22:00:03.640Z")]
    ];

    const { selectedCategory } = this.state;
    const _value = selectedCategory && selectedCategory.value;

    let isCategoriesInvalid = ( !selectedCategory || selectedCategory.value == null);
    let categoriesSelectorClassNames = classNames('categoriesSelector', {
        'inputValidationError': this.state.renderChart  && isCategoriesInvalid
    });

    let isServicesInvalid = !selectedServices;
    let servicesSelectorClassName = classNames('servicesSelector', {
        'inputValidationError': this.state.renderChart && isServicesInvalid
    });

    let isFromDateInvalid = !this.state.fromDate;
    let fromDateClassName = classNames('', {
      'inputValidationError': this.state.renderChart && isFromDateInvalid
    })

    let isTillDateInvalid = !this.state.tillDate;
    let tillDateClassName = classNames('', {
      'inputValidationError': this.state.renderChart && isTillDateInvalid
    })

    let timeline = this.state.renderChart && !isCategoriesInvalid && !isServicesInvalid
                   && !isFromDateInvalid && !tillDateClassName ?
                    <Chart chartType="Timeline"
                           columns={chartColumns}
                           rows={chartRows}
                           options='width:600px'
                           width='100%'
                           chartPackage='timeline'
                    /> : null;

    return (<main className="main-container maxHeight">
                <div className="main-content maxHeight">
                  <div className="media-list media-list-divided media-list-hover">
                    <header style={this.styles.selectionHeader}
                            className="flexbox align-items-center media-list-header bg-transparent b-0 py-16">

                        <QueryRenderer
                            environment={environment}
                            query={categoriesQuery}
                            variables={{}}
                            render={this.renderCategories}/>
`
                        <Select
                            className={categoriesSelectorClassNames}
                            name="categoriesSelector"
                            required
                            placeholder="Select category"
                            options={this.props.categories}
                            value={_value}
                            onChange={this._updateCategory}
                        />

                        <Select
                            className={servicesSelectorClassName}
                            multi
                            simpleValue
                            disabled={this.state.serviceSelectorDisabled}
                            removeSelected={true}
                            onChange={this._serviceNameChanged}
                            name="servicesSelector"
                            placeholder="Select services(s)"
                            options={this.state.services}
                            value={value}
                        />

                        <div className="align-items-center flexbox">
                          <div>From</div>
                          <Datetime
                              className={fromDateClassName}
                              onChange={this._fromDateChanged}
                              closeOnSelect={true}
                              locale="he"/>
                          <div>Till</div>
                          <Datetime
                              className={tillDateClassName}
                              onChange={this._tillDateChanged}
                              closeOnSelect={true}
                              locale="he"/>
                          <button className="btn btn-info"
                            onClick={this._apply}>Apply</button>
                        </div>

                    </header>
                    {timeline}
                  </div>
                </div>
            </main>);
  }

};

// Mocks

class EsbAPI {
  static getAllCategories() {
    return new Promise( (resolve, reject) => {
      setTimeout( () => {
        resolve(_.assign([], [
            {value: '1', label: 'משרד התחבורה'},
            {value: '2', label: 'שירותי מיקום'},
            {value: '3', label: 'דיגיתל'},
            {value: '4', label: 'מחו"ג'},
            {value: '5', label: 'עירייה זמינה'},
            {value: '6', label: 'ארנונה'},
            {value: '28', label: 'CRM'},
        ]
      ))
      }, 1000);
    })
  }

  static getServicesByCategoryId(categoryId: number) {
    return new Promise( (resolve, reject) => {
        setTimeout( () => {
            resolve(_.assign([], [
              { value: 'three', label: 'Three' },
              { value: 'four', label: 'Four' },
            ]))
        }, 1000);
    });
  }
}

function mapStateToProps(state) {
  return {
      categories: state.categories,
  }

}

export default connect(mapStateToProps)(Stats);
