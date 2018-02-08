// @flow
import React from 'react';
import { createRefetchContainer, graphql } from 'react-relay';
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
import EsbServices from './EsbServices';

type Props = {
  categories: Array<{
    name: string,
    objectId: number
  }>
};

type State = {
  fromDate: {},
  tillDate: {},
  renderChart: boolean,
  selectedCategory: Object
};

class Stats extends React.Component<Props, State> {

  constructor(props) {
    super(props);

    this.state = {
      fromDate: null,
      tillDate: null,
      services: [],
      renderChart: false,
      selectedCategory: null
    }

    this.styles = {
      selectionHeader: {
        flexWrap: "nowrap"
      }
    }

    this._apply = this._apply.bind(this);
    this._updateCategory = this._updateCategory.bind(this);
    this._fromDateChanged = this._fromDateChanged.bind(this);
    this._tillDateChanged = this._tillDateChanged.bind(this);
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
      selectedCategory: newCategory
    });

    this.props.relay.refetch(
      (prev) => (
        { categoryId: newCategory ? newCategory.value : null }
      ),
      null,
      null,
      { force: false } // Network layer for this app is configured to use cache (vis QueryResponseCache)
                       // This parameter has the meaning for it.
                       // Although it is redundant here because the default is false.
    )
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

  render() {

    let repository = this.props.repository;
    let categories = this.props.categories.map( category => {
      return {
        value: category.objectId,
        label: category.name
      }
    });

    const selectedServices = this.refEsbCategories ?
                              this.refEsbCategories.selectedServices :
                              null;

    let chartColumns = [
      {"id":"Stage","type":"string"},
      {"id":"Start","type":"date"},
      {"id":"End","type":"date"}
    ];

    let chartRows = [
      ["Pre-processing",new Date("2018-01-17T22:00:01.000Z"), new Date("2018-01-17T22:00:01.050Z")],
      ["Cross-domain transport",  new Date("2018-01-17T22:00:01.050Z"), new Date("2018-01-17T22:00:02.000Z")],
      ["Destination Service", new Date("2018-01-17T22:00:02.000Z"), new Date("2018-01-17T22:00:03.000Z")],
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
    let fromDateClassName = classNames('timePicker', {
      'inputValidationError': this.state.renderChart && isFromDateInvalid
    })

    let isTillDateInvalid = !this.state.tillDate;
    let tillDateClassName = classNames('timePicker', {
      'inputValidationError': this.state.renderChart && isTillDateInvalid
    })

    let timeline = this.state.renderChart && !isCategoriesInvalid && !isServicesInvalid
                   && !isFromDateInvalid && !isTillDateInvalid ?
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

                        <Select
                            className={categoriesSelectorClassNames}
                            name="categoriesSelector"
                            required
                            placeholder="Select category"
                            options={categories}
                            value={_value}
                            onChange={this._updateCategory}
                        />

                        <EsbServices
                          className={servicesSelectorClassName}
                          ref={c => { this.refEsbCategories = c; }}
                          disabled={!this.state.selectedCategory}
                          services={repository.services} />

                        <div className="align-items-center flexbox timePickerArea">
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

export default createRefetchContainer(
Stats,
{
  repository: graphql`
      fragment Stats_repository on Repository
      @argumentDefinitions(
        categoryId: { type: Int }
      )
      {
        services(categoryId: $categoryId) {
          objectId
          name
        }
      }
  `
},
graphql`
    query Stats_Query ($categoryId: Int) {
      repository {
        ...Stats_repository @arguments(categoryId: $categoryId)
      }
    }
`);
