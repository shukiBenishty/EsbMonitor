// @flow
import React from 'react';
import { createRefetchContainer, commitMutation, graphql } from 'react-relay';
import { AutoSizer, List } from 'react-virtualized';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import { css } from 'glamor';
import classNames from 'classnames';
import TextField from 'material-ui/TextField';

import EsbService from './EsbService';
import EsbServiceRequest from './EsbServiceRequest';
import environment from './Environment';

 const addServiceMutation = graphql`
   mutation EsbAdminMutation(
     $input: ServiceInput
   ) {
     addService(input: $input) {
       objectId
       created
     }
   }
 `;

type Props = {
};

type State = {
  servicePanelVisible: boolean,
  selectedCategory: Object,
  currentServicesPage: number
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
      environmentForNewService: {},
      categories: [],
      currentServicesPage: 1,

      isNewServiceNameValid: true,
      isNewServiceAddressValid: true,
      isNewServiceCategoryIdValid: true,
      isNewServiceSLAValid: true,
      isNewServiceEnvironment: true
    };

    this.styles = {
      categoriesSelectorStyle: {
        position: 'absolute',
        right: '0px',
        marginTop: '-30px',
        marginRight: '30px',
        width: '14%',
        zIndex: '100'
      },
      listTitle: {
        borderBottom: "0"
      },
      textFieldStyle: {
        marginTop: "-20px"
      },
      formItem: {
        alignSelf: "flex-end",
        color: "rgba(77, 82, 89, 0.8)"
      },
      formSelector: {
        paddingLeft: "0px",
        paddingRight: "0px"
      },
      formRow: {
        marginTop: "18px"
      }
    }

    this._addService = this._addService.bind(this);
    this._openServicePanel = this._openServicePanel.bind(this);
    this._closeServicePanel = this._closeServicePanel.bind(this);
    this._updateCategory = this._updateCategory.bind(this);
    this._addServiceCategoryChanged = this._addServiceCategoryChanged.bind(this);
    this._addServiceEnvironmentChanged = this._addServiceEnvironmentChanged.bind(this);

    this.pageClicked = this.pageClicked.bind(this);

    this.rowRenderer = this.rowRenderer.bind(this);
    this.rowRequestRenderer = this.rowRequestRenderer.bind(this);
  }

  _addService() {

    let _serviceNameValid = this._serviceName.value != null
                            && this._serviceName.value != '';
    let _serviceCategoryValid = this.state.selectedCategoryForNewService != null
                                && this.state.selectedCategoryForNewService.value != null
                                && this.state.selectedCategoryForNewService.value != '';
    let _serviceEnvironmentValid = this.state.environmentForNewService != null
                                  && this.state.environmentForNewService.value != null
                                && this.state.environmentForNewService.value != ''
    let _serviceNameAddressValid = this._serviceAddress.value != null
                              && this._serviceAddress.value != '';
    let _serviceSlaValid = this._expectedSLA.value != null
                            && this._expectedSLA.value != '';

    this.setState({
      isNewServiceNameValid:  _serviceNameValid,
      isNewServiceAddressValid: _serviceNameAddressValid,
      isNewServiceCategoryIdValid: _serviceCategoryValid,
      isNewServiceSLAValid: _serviceSlaValid,
      isNewServiceEnvironment: _serviceEnvironmentValid
    });

    // End of validaton

    if( _serviceNameValid &&
        _serviceCategoryValid &&
        _serviceNameAddressValid &&
        _serviceSlaValid &&
        _serviceEnvironmentValid ) {

      this.setState({
          servicePanelVisible: false
      })

      let servicePattern = this._servicePattern.checked ?
                           "Soap" : "Rest" ;

      const variables =
      {
        input: {
          name: this._serviceName.value,
          categoryId: this.state.selectedCategoryForNewService.value,
          address: this._serviceAddress.value,
          sla: this._expectedSLA.value,
          environment: this.state.environmentForNewService.label,
          pattern: servicePattern
        },
      };

      const toastId = toast("Adding Service to Repository", { autoClose: false});
      commitMutation(
        this.props.relay.environment,
        {
            mutation: addServiceMutation,
            variables,
            updater: (store) => {

              let root = store.getRoot();
              console.log(root);

            },
            onCompleted: (response, errors) => {
              if( errors ) {
                toast.error(errors);
              } else {
                toast.update(toastId,
                              {
                                render: "Service Request with ID " + response.addService.objectId + " was added",
                                type: toast.TYPE.SUCCESS,
                                autoClose: 3000,
                                className: css({
                                  transform: "rotateY(360deg)",
                                  transition: "transform 0.6sec"
                                })
                              });
              }
            },
            onError: err => {
              console.log(err.message);
              toast.update(toastId,
                {
                  render: err.message,
                  type: toast.TYPE.ERROR,
                  autoClose: 5000
                })
            }

        });
    }
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

    this.props.relay.refetch(
      (prev) => (
        {
          categoryId: newCategory ? newCategory.value : null,
          page: this.state.currentServicesPage,
          pageSize: 10
        }
      ),
      null,
      null,
      { force: false } // Network layer for this app is configured to use cache (vis QueryResponseCache)
                       // This parameter has the meaning for it.
                       // Although it is redundant here because the default is false.
    )
  }

  _addServiceCategoryChanged(newCategory) {
    this.setState({
      selectedCategoryForNewService: newCategory
    });
  }

  _addServiceEnvironmentChanged(newEnvironment) {
    this.setState({
      environmentForNewService: newEnvironment
    })
  }

  pageClicked(pageNumber: number) {

    this.props.relay.refetch(
      (prev) => (
        {
          categoryId: this.state.selectedCategory ? this.state.selectedCategory.value : null,
          page: pageNumber,
          pageSize: 10
        }
      ),
      null,
      null,
      { force: false } // Network layer for this app is configured to use cache (vis QueryResponseCache)
                       // This parameter has the meaning for it.
                       // Although it is redundant here because the default is false.
    );

    this.setState({
      currentServicesPage: pageNumber
    })

  }

  rowRenderer({
    key,
    index,
    isScrolling,
    isVisible,
    style
  }) {

    //this.vServicesList.scrollToRow(index);

    let _services = this.props.repository.services;

    return <EsbService key={index}
                       service={_services[index]} />
  }

  rowRequestRenderer({
    key,
    index,
    isScrolling,
    isVisible,
    style
  }) {

    //this.vServiceRequestList.scrollToRow(index);

    let requests = this.props.repository.serviceRequests;

    return <EsbServiceRequest key={index}
                              serviceRequest={requests[index]} />

  }

  render() {

    let _environments = [{
      value: 1,
      label: 'External'
    }, {
      value: 0,
      label: 'Internal'
    }];

    let _categories = this.props.categories.map( (category, index) => {
        return {
          value: category.objectId,
          label: category.name
        }
    })

    let _services = this.props.repository.services;
    let _serviceRequests = this.props.repository.serviceRequests;

    var servicePanelClass = classNames('quickview', 'quickview-lg', {
      'reveal': this.state. servicePanelVisible
    });

    const { selectedCategory } = this.state;
    const _value = selectedCategory && selectedCategory.value;

    const { selectedCategoryForNewService } = this.state;
    const _newServiceCategoryValue = selectedCategoryForNewService && selectedCategoryForNewService.value;

    const { environmentForNewService } = this.state
    const _newServiceEnvironment= environmentForNewService && environmentForNewService.value;

    // Validation errors
    let errorMessage = !this.state.isNewServiceNameValid ?
                       "This field is requied" : "";
    let categoriesSelectorClassNames = classNames('col col-9', {
         'inputValidationError': !this.state.isNewServiceCategoryIdValid
    });
    let environmentSelectorClassNames = classNames('col col-9', {
        'inputValidationError': !this.state.isNewServiceEnvironment
    });

    let errorMessageAddress = !this.state.isNewServiceAddressValid ?
                              "This field is requied" : "";
    let errorMessageSLA = !this.state.isNewServiceSLAValid ?
                              "This field is requied" : "";
    // End od validation errors

    return (<main className="main-container maxHeight">
                <ToastContainer />
                <div className="main-content maxHeight">
                  <div className="media-list media-list-divided media-list-hover">
                    <header className="media-list-header bg-transparent b-0 py-16 pl-20">
                      <div style={this.styles.categoriesSelectorStyle}>
                        <Select
                            className='categoriesSelector'
                            name="categoriesSelector"
                            placeholder="Select category"
                            options={_categories}
                            value={_value}
                            onChange={this._updateCategory}
                        />
                      </div>
                    </header>
                    <div className="row">
                      <div className="col-lg-3 tab-content">
                          <div className="card">
                            <ul className="nav nav-tabs nav-lg _flexColumn">
                              <li className="active">
                                <a data-toggle="tab" className="nav-link active show" href="#tab1">Services</a>
                              </li>
                              <li>
                                <a data-toggle="tab" className="nav-link" href="#tab2">Requests</a>
                              </li>
                            </ul>
                          </div>
                      </div>

                      <div className="col-lg-9 tab-content">
                        <div className="card tab-pane fade in active show" id="tab1">
                          <h4 style={this.styles.listTitle}
                              className="card-title fw-400">Published Services</h4>

                          <div className="row">
                          <div className="col-lg-10"></div>
                          <div className="col-lg-2">
                              <nav>
                                <ul className="pagination pagination-circle">
                                  {
                                    [1,2,3].map( pageNumber => {

                                      var pageNumberClassName = classNames('page-item', {
                                        'active': pageNumber == this.state.currentServicesPage
                                      });

                                      return <li key={pageNumber} className={pageNumberClassName}
                                                  onClick={()=>this.pageClicked(pageNumber)} >
                                                <div className="page-link">{pageNumber}</div>
                                             </li>

                                    })
                                  }
                                </ul>
                              </nav>
                          </div>
                          </div>

                            <AutoSizer>
                              {
                                ({height, width}) => (

                                  <List ref={ c => { this.vServicesList = c; }}
                                    width={width}
                                    height={height}
                                    autoHeight={true}
                                    rowHeight={60}
                                    rowGetter={ ({index}) => _services[index] }
                                    rowCount={_services.length}
                                    rowRenderer={this.rowRenderer}
                                  />

                                )
                              }
                            </AutoSizer>

                        </div>
                        <div className="card tab-pane fade" id="tab2">
                          <h4 style={this.styles.listTitle}
                              className="card-title fw-400">Publish Requests</h4>

                            <AutoSizer>
                              {
                                ({height, width}) => (

                                  <List ref={ c => { this.vServiceRequestList = c; }}
                                    width={width}
                                    height={height}
                                    autoHeight={true}
                                    rowHeight={60}
                                    rowGetter={ ({index}) => _serviceRequests[index] }
                                    rowCount={_serviceRequests.length}
                                    rowRenderer={this.rowRequestRenderer}
                                  />

                                )
                              }
                            </AutoSizer>

                        </div>
                      </div>

                    </div>
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
                      <div>
                         <TextField
                                type='text'
                                style={this.styles.textFieldStyle}
                                hintText="Name"
                                floatingLabelText="Serice's name"
                                fullWidth={true}
                                errorText = {errorMessage}
                                ref={
                                  (el) => {
                                    if( el )
                                      this._serviceName = el.input;
                                  }
                                } />
                      </div>
                      <div>
                        <TextField
                              style={this.styles.textFieldStyle}
                              ref={
                                  (el) => {
                                    if( el )
                                      this._serviceAddress = el.input
                                  }
                              }
                              fullWidth={true}
                              hintText="URL"
                              errorText = { errorMessageAddress }
                              floatingLabelText="Address (URL)"/>
                      </div>

                      <div style={this.styles.formRow}>
                        <label className="switch">
                          <input type="checkbox"
                                  ref={
                                    el => {
                                      if( el )
                                        this._servicePattern = el;
                                    }
                                  }/>
                          <span className="switch-indicator">
                          </span>
                          <span className="switch-description">
                            Old Fashion (SOAP)
                          </span>
                        </label>
                      </div>

                      <div className="row" style={this.styles.formRow}>
                        <label style={this.styles.formItem}
                               className="col col-3">Environment:</label>
                        <Select
                          ref={
                            el => {
                              if( el )
                                this._serviceEnvironment = el ;
                            }
                          }
                          style={this.styles.formSelector}
                          className={environmentSelectorClassNames}
                          name="addServiceDomainSelector"
                          placeholder="Select environment"
                          options={_environments}
                          value={_newServiceEnvironment}
                          onChange={this._addServiceEnvironmentChanged}
                        />

                      </div>
                      <div className="row" style={this.styles.formRow}>
                        <label style={this.styles.formItem}
                               className="col col-3">Category:</label>
                        <Select
                          ref={
                            el => {
                              if( el )
                                this._serviceCategory = el.input.input;
                            }
                          }
                          style={this.styles.formSelector}
                          className={categoriesSelectorClassNames}
                          name="addServiceCategoriesSelector"
                          placeholder="Select category"
                          options={_categories}
                          value={_newServiceCategoryValue}
                          onChange={this._addServiceCategoryChanged} />

                      </div>
                      <div style={this.styles.formRow}>
                        <TextField
                              type='number'
                              style={this.styles.textFieldStyle}
                              ref={
                                  (el) => {
                                    if( el )
                                      this._expectedSLA = el.input
                                  }
                              }
                              fullWidth={true}
                              errorText = { errorMessageSLA }
                              hintText="Number of milliseconds"
                              floatingLabelText="Expected SLA"/>
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

export default createRefetchContainer(
EsbAdmin,
graphql`
  fragment EsbAdmin_repository on Repository
  @argumentDefinitions(
    categoryId: { type: Int }
    page: { type: Int, defaultValue: 1 }
    pageSize: { type: Int, defaultValue: 10}
  )
  {
    services (categoryId: $categoryId, page: $page, pageSize: $pageSize){
      ...EsbService_service
    }
    serviceRequests {
      objectId
      operationName
      address
      environment
      created
    }
}
`,
graphql`
  query EsbAdmin_Query
  (
    $categoryId: Int
    $page: Int
    $pageSize: Int
  )
  {
    repository {
    	...EsbAdmin_repository @arguments(categoryId: $categoryId,
                                        page: $page,
                                        pageSize: $pageSize)
    }
  }
`
);
