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
  tillDate: {},
  renderChart: boolean,
  serviceSelectorDisabled: boolean
};

class Stats extends React.Component<Props, State> {

  constructor() {
    super();

    this.state = {
      fromDate: null,
      tillDate: null,
      selectedServices: '',
      serviceSelectorDisabled: true,
      renderChart: false,
      categories: [],
      selectedCategory: ''
    }

    this.styles = {
      selectorStyle : {
        width: "400px"
      },
      categoriesSelectorStyle: {
        width: "200px"
      }
    }

    this._apply = this._apply.bind(this);
    this._updateCategory = this._updateCategory.bind(this);
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

  _updateCategory(newCategory: string) {

    let disableCategoriesSelector = !newCategory ? true : false;

    this.setState({
      selectedCategory: newCategory,
      serviceSelectorDisabled: disableCategoriesSelector,
      selectedServices: ''
    });

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
    let promise = EsbAPI.getAllCategories();
    promise.then( _categories => {
      this.setState({
        categories: _categories
      })
    })

  };

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
                      <Select style={this.styles.categoriesSelectorStyle}
                        name="categoriesSelector"
                        ref={(ref) => { this.select = ref; }}
                        simpleValue
                        placeholder="Select category"
                        options={this.state.categories}
                        value={this.state.selectedCategory}
                        onChange={this._updateCategory}
                      />
                      <Select style={this.styles.selectorStyle}
                              multi
                              simpleValue
                              disabled={this.state.serviceSelectorDisabled}
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

// Mocks

// [
//   {"CategoryId":30,"CategoryName":"Active Directory"},
//   {"CategoryId":0,"CategoryName":"ALL"},
//   {"CategoryId":28,"CategoryName":"CRM"},
//   {"CategoryId":33,"CategoryName":"SAP"},
//   {"CategoryId":32,"CategoryName":"UC4"},
//   {"CategoryId":20,"CategoryName":"ארכיון"},
//   {"CategoryId":23,"CategoryName":"ארנונה"},
//   {"CategoryId":3,"CategoryName":"דיגיתל"},
//   {"CategoryId":25,"CategoryName":"זימון תורים"},
//   {"CategoryId":16,"CategoryName":"חינוך"},
//   {"CategoryId":51,"CategoryName":"חניונים"},
//   {"CategoryId":10,"CategoryName":"טלאול"},
//   {"CategoryId":41,"CategoryName":"מאיה"},
//   {"CategoryId":27,"CategoryName":"מובייל"},
//   {"CategoryId":4,"CategoryName":"מחו\"ג"},
//   {"CategoryId":13,"CategoryName":"מסופונים"},
//   {"CategoryId":43,"CategoryName":"מערך פלילי"},
//   {"CategoryId":37,"CategoryName":"מערכת לוגיסטית"},
//   {"CategoryId":34,"CategoryName":"משאבי אנוש"},
//   {"CategoryId":1,"CategoryName":"משרד התחבורה"},
//   {"CategoryId":19,"CategoryName":"משרדים ממשלתיים"},
//   {"CategoryId":21,"CategoryName":"נכסים"},
//   {"CategoryId":5,"CategoryName":"עירייה זמינה"},
//   {"CategoryId":6,"CategoryName":"עמ\"ל"},
//   {"CategoryId":42,"CategoryName":"רישוי בניה תושב"},
//   {"CategoryId":15,"CategoryName":"רישוי מקוון"},
//   {"CategoryId":48,"CategoryName":"רישוי עסקים מקוון"},
//   {"CategoryId":2,"CategoryName":"שירותי מיקום"},
//   {"CategoryId":24,"CategoryName":"שירותים חיצוניים"},
//   {"CategoryId":44,"CategoryName":"תיאום הנדסי"},
//   {"CategoryId":12,"CategoryName":"תשתיות אינטגרציה"}
// ]

class EsbAPI {
  static getAllCategories() {
    return new Promise( (resolve, reject) => {
      setTimeout( () => {
        resolve(_.assign([], [
            {value: 'משרד התחבורה', label: 'משרד התחבורה'},
            {value: 'שירותי מיקום', label: 'שירותי מיקום'},
            {value: 'דיגיתל', label: 'דיגיתל'},
            {value: 'מחו"ג', label: 'מחו"ג'},
            {value: 'עירייה זמינה', label: 'עירייה זמינה'},
            {value: 'ארנונה', label: 'ארנונה'},
            {value: 'CRM', label: 'CRM'},
        ]
      ))
      }, 1000);
    })
  }
}

export default Stats;
