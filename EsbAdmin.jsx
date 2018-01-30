// @flow
import React from 'react';
import { QueryRenderer, commitMutation, graphql } from 'react-relay';
import Select from 'react-select';
import classNames from 'classnames';

import EsbService from './EsbService';
import environment from './Environment';

 const addServiceMutation = graphql`
   mutation EsbAdminMutation {
     publishService(input: {
        name: "s",
        categoryId: 2,
        address: "http://sss",
        description: "descripion",
        sla: 200,
        affiliations: "Digitel"
     }) {
       id
     }
   }
 `;

const servicesQuery = graphql`
  query EsbAdminQuery {
    services {
      ...EsbService_service
    }
    categories {
      name
      id
    }
  }
`;

type Props = {
};

type State = {
  servicePanelVisible: boolean,
  selectedCategory: Object
}

class EsbAdmin extends React.Component<Props, State> {

  // state = {
  //   servicePanelVisible: false
  // };

  constructor() {
    super();

    this.state = {
      servicePanelVisible: false,
      selectedCategory: {},
      selectedCategoryForNewService: {},
      categories: []
    };

    this.styles = {
      categoriesSelectorStyle: {
        position: 'absolute',
        right: '0px',
        marginTop: '-30px',
        marginRight: '30px',
        width: '14%'
      },
      addServiceCategorySelector: {
        marginTop: "46px"
      }
    }

    this._addService = this._addService.bind(this);
    this._openServicePanel = this._openServicePanel.bind(this);
    this._closeServicePanel = this._closeServicePanel.bind(this);
    this._updateCategory = this._updateCategory.bind(this);
    this._addServiceCategoryChanged = this._addServiceCategoryChanged.bind(this);
    this.renderRelayQuey = this.renderRelayQuey.bind(this);
  }

  _addService() {
    // TBD
    console.log('Adding new service');

    this.setState({
        servicePanelVisible: false
    })

    const variables =
    {
      input: {
        name: "s",
        categoryId: 2,
        address: "http://sss",
        description: "descripion",
        sla: 200,
        affiliations: ["Digitel", "two"]
      },
    };

    commitMutation(
      environment,
      {
          mutation: addServiceMutation,
          variables,
          updater: (store) => {
            console.log(store);
          },
          onCompleted: (response, errors) => {
            console.log(response);
          },
          onError: err => console.error(err)
      });
  }

  _openServicePanel() {

    this.setState({
      servicePanelVisible: true
    })
  }

   _closeServicePanel() {

    this.setState({
        servicePanelVisible: false
    })
  }

  _updateCategory(newCategory) {

    let disableCategoriesSelector = !newCategory ? true : false;

    this.setState({
      selectedCategory: newCategory,
      serviceSelectorDisabled: disableCategoriesSelector,
      selectedServices: ''
    });
  }

  _addServiceCategoryChanged(newCategory) {
    this.setState({
      selectedCategoryForNewService: newCategory
    });
  }

  renderRelayQuey({error, props, retry}) {
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

    this.setState({
      categories: normalizedCategories
    });

    return (<div className="media-list-body bg-white b-1">{
              props.services.map( (service, index) => {
                return <EsbService key={index} service={service} />
              } )
            }</div>)
  }

  render() {

    var servicePanelClass = classNames('quickview', 'quickview-lg', {
      'reveal': this.state. servicePanelVisible
    });

    const { selectedCategory } = this.state;
    const _value = selectedCategory && selectedCategory.value;

    const { selectedCategoryForNewService } = this.state;
    const _newServiceCategoryValue = selectedCategoryForNewService && selectedCategoryForNewService.value;

    return (<main className="main-container maxHeight">
                <div className="main-content maxHeight">
                  <div className="media-list media-list-divided media-list-hover">
                    <header className="media-list-header bg-transparent b-0 py-16 pl-20">
                      <div style={this.styles.categoriesSelectorStyle}>
                        <Select
                            className='categoriesSelector'
                            name="categoriesSelector"
                            placeholder="Select category"
                            options={this.state.categories}
                            value={_value}
                            onChange={this._updateCategory}
                        />
                      </div>
                    </header>
                    <QueryRenderer
                        environment={environment}
                        query={servicesQuery}
                        variables={{}}
                        render={this.renderRelayQuey}/>
                  </div>
                </div>
                <div className="fab fab-fixed">
                 <a className="btn btn-float btn-primary" onClick={this._openServicePanel}>
                   <i className="ti-plus"></i>
                 </a>
                </div>
                <div className={servicePanelClass}>
                  <header className="quickview-header">
                    <p className='quickview-title lead fw-400'>Add new service</p>
                    <span onClick={this._closeServicePanel}>
                      <i className="ti-close"></i>
                    </span>
                  </header>
                  <div className="quickview-body ps-container ps-theme-default ps-active-y">
                    <div className="quickview-block form-type-material">
                      <h6>Service Details</h6>
                      <div className="form-group">
                        <input type="text" className="form-control" />
                        <label>Name</label>
                      </div>
                      <div className="form-group">
                        <input type="text" className="form-control" />
                        <label>Address (URL)</label>
                      </div>
                      <div className="form-group">
                        <Select
                          style={this.styles.addServiceCategorySelector}
                          name="addServiceCategoriesSelector"
                          placeholder="Select category"
                          options={this.state.categories}
                          value={_newServiceCategoryValue}
                          onChange={this._addServiceCategoryChanged} />
                        <label>Category</label>
                      </div>
                      <div className="form-group">
                        <input type="text" className="form-control" />
                        <label>Expected SLA</label>
                      </div>
                      <div className="form-group">
                        <input type="text" className="form-control" />
                        <label>Affiliated System</label>
                      </div>

                    </div>
                  </div>
                  <footer className="p-12 text-right">
                    <button className="btn btn-flat btn-primary"
                      onClick={this._addService}>Add service</button>
                  </footer>
                </div>
            </main>
         );

  }

};

export default EsbAdmin;
