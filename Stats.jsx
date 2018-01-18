// @flow
import React from 'react';
import moment from 'moment';
import 'moment/locale/he';
import Datetime from 'react-datetime';
import { Chart } from 'react-google-charts';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

type Props = {

};

type State = {
  fromDate: {},
  tillDate: {}
};

class Stats extends React.Component<Props, State> {

  constructor() {
    super();

    this.state = {
      fromDate: null,
      tillDate: null,
      selectedServices: '',
      renderChart: false
    }

    this.styles = {
      selectorStyle : {
        width: "400px"
      }
    }

    this._apply = this._apply.bind(this);
    this._fromDateChanged = this._fromDateChanged.bind(this);
    this._tillDateChanged = this._tillDateChanged.bind(this);
    this._serviceNameChanged = this._serviceNameChanged.bind(this);
  }

  _apply() {
    console.log(this.state.fromDate + ' ' + this.state.tillDate);
    console.log('Apply');

    this.setState({
      renderChart: true
    })
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

    // this.setState({
    //   services: [...this.state.services, item]
    // });

  }

  // shouldComponentUpdate() {
  //   // prevent rendering after dates changes
  //   return false;
  // }

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

    let timeline = this.state.renderChart ?  <Chart chartType="Timeline"
                                           columns={chartColumns}
                                           rows={chartRows}
                                           options='width:600px'
                                           width='100%'
                                           chartPackage='timeline'
                                           /> : null;

    return (<main className="main-container maxHeight">
                <div className="main-content maxHeight">
                  <div className="media-list media-list-divided media-list-hover">
                    <header className="flexbox align-items-center media-list-header bg-transparent b-0 py-16 pl-20">
                      <div className="flexbox align-items-center">
                      <Select style={this.styles.selectorStyle}
                              multi
                              simpleValue
                              removeSelected={true}
                              onChange={this._serviceNameChanged}
                              name="servicesSelector"
                              placeholder="Select services(s)"
                              options={services}
                              value={value}
                            />
                        <div>From</div>
                        <Datetime
                          onChange={this._fromDateChanged}
                          closeOnSelect={true}
                          locale="he"/>
                        <div>Till</div>
                        <Datetime
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

export default Stats;
