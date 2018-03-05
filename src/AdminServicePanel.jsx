// @flow
import * as React from 'react';
import { commitMutation, graphql } from 'react-relay';
import classNames from 'classnames';
import TextField from 'material-ui/TextField';
import Select from 'react-select';

import environment from './Environment';

//import AddServiceMutation from '../mutations/AddServiceMutation'

const addServiceMutation = graphql`
  mutation AdminServicePanel_Mutation(
    $input: ServiceInput
  ) {
    addService(input: $input) {
      id
      objectId
      name
      categoryId
      environment
      address
      sla
      created
    }
  }
`;

type Props = {
  onClose: {},
  onServiceAdding?: {},
  onServiceAdded?: {}
}

class AdminServicePanel extends React.Component<Props> {

  constructor(props) {
    super(props);

    this.state = {

      category: {},
      environment: {},

      isServiceNameValid: true,
      isServiceAddressValid: true,
      isServiceCategoryIdValid: true,
      isServiceSLAValid: true,
      isServiceEnvironmentValid: true
    }

    this.styles = {
      textFieldStyle: {
        marginTop: "-20px"
      },
      formRow: {
        marginTop: "18px"
      },
      formItem: {
        alignSelf: "flex-end",
        color: "rgba(77, 82, 89, 0.8)"
      },
      formSelector: {
        paddingLeft: "0px",
        paddingRight: "0px"
      }
    }

    this.close = this.close.bind(this);
    this.addService = this.addService.bind(this);
    this.environmentChanged = this.environmentChanged.bind(this);
    this.categoryChanged = this.categoryChanged.bind(this);
  }

   close() {
     this.props.onClose();
   }

   categoryChanged(newCategory) {
     this.setState({
       category: newCategory
     });
   }

   environmentChanged(newEnvironment) {
     this.setState({
       environment: newEnvironment
     })

   }

   addService() {
     let _serviceNameValid = this._serviceName.value != null
                             && this._serviceName.value != '';
     let _serviceNameAddressValid = this._serviceAddress.value != null
                               && this._serviceAddress.value != '';
     let _serviceCategoryValid = this.state.category != null
                                 && this.state.category.value != null
                                 && this.state.category.value != '';
     let _serviceEnvironmentValid = this.state.environment != null
                                   && this.state.environment.value != null;

     let _serviceSlaValid = this._expectedSLA.value != null
                             && this._expectedSLA.value != '';

     this.setState({
       isServiceNameValid:  _serviceNameValid,
       isServiceAddressValid: _serviceNameAddressValid,
       isServiceCategoryIdValid: _serviceCategoryValid,
       isServiceSLAValid: _serviceSlaValid,
       isServiceEnvironmentValid: _serviceEnvironmentValid
     });
     // End of validaton

     if( _serviceNameValid &&
         _serviceCategoryValid &&
         _serviceNameAddressValid &&
         _serviceSlaValid &&
         _serviceEnvironmentValid ) {

           let servicePattern = this._servicePattern.checked ?
                                "Soap" : "Rest" ;

           this.props.onClose();

           const variables =
           {
             input: {
               name: this._serviceName.value,
               categoryId: this.state.category.value,
               address: this._serviceAddress.value,
               sla: this._expectedSLA.value,
               environment: this.state.environment.label,
               pattern: servicePattern
             },
           };

          if( this.props.onServiceAdding )
            this.props.onServiceAdding();

          const self = this.props;

          commitMutation(
              environment,
              {
                  mutation: addServiceMutation,
                  variables,
                  updater: (proxyStore: RecordSourceSelectorProxy) => {

                    // Read off payload
                    const payloadProxy = proxyStore.getRootField('addService');
                    if( payloadProxy ) {
                      const _id = payloadProxy.getValue('id');
                      const _created = payloadProxy.getValue('created');
                      const _objectId = payloadProxy.getValue('objectId');
                      const _name = payloadProxy.getValue('name');
                      const _categoryId = payloadProxy.getValue('categoryId');
                      const _environment = payloadProxy.getValue('environment');
                      const _address = payloadProxy.getValue('address');
                      const _sla = payloadProxy.getValue('sla');

                      // Read from store's root
                      let root = proxyStore.getRoot();
                      let __type = root.getType();
                      let repositoryRecord = root.getLinkedRecord('repository');
                      if( repositoryRecord ) {
                        let serviceRequestsRecords = repositoryRecord.getLinkedRecords('serviceRequests') || [];

                        const newServiceRequests = [...serviceRequestsRecords, {
                              id: _id,
                              created: _created,
                              objectId: _objectId,
                              name: _name,
                              categoryId: _categoryId,
                              environment: _environment,
                              address: _address,
                              sla: _sla
                        }];

                        //repositoryRecord.setLinkedRecords(newServiceRequests, 'serviceRequests');
                      }
                    }
                  },
                  onCompleted: (response, errors) => {
                      if( errors ) {
                        console.log(errors);
                        if( self.onServiceAdded ){
                           self.onServiceAdded({
                             isAdded: false,
                             message: errors[0].message
                           })
                        }
                      } else {
                        console.log(response);
                        if( self.onServiceAdded ) {
                           self.onServiceAdded({
                             isAdded: true,
                             message: "Service Request with ID " + response.addService.objectId + " was added"
                           })
                        }
                      }
                  },
                  onError: err => {
                    console.log(err.message);
                  }
              }
           );

     }
   }

  render() {

    let _environments = [{
      value: 1,
      label: 'External'
    }, {
      value: 0,
      label: 'Internal'
    }];

    let _categories = this.props.categories;

    const { environment } = this.state
    const serviceEnvironment= environment && environment.value;

    const { category } = this.state;
    const categoryValue = category && category.value;

    // Validation errors
    let errorMessage = !this.state.isServiceNameValid ?
                       "This field is requied" : "";
    let errorMessageAddress = !this.state.isServiceAddressValid ?
                               "This field is requied" : "";
    let errorMessageSLA = !this.state.isServiceSLAValid ?
                             "This field is requied" : "";

    let environmentSelectorClassNames = classNames('col col-9', {
         'inputValidationError': !this.state.isServiceEnvironmentValid
    });
    let categoriesSelectorClassNames = classNames('col col-9', {
         'inputValidationError': !this.state.isServiceCategoryIdValid
    });
    // End of validation errors

    return (<div>
              <header className="quickview-header">
                <p className='quickview-title lead fw-400'>Add new service</p>
                <span onClick={this.close}>
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
                         name="EnvironmentSelector"
                         placeholder="Select environment"
                         options={_environments}
                         value={serviceEnvironment}
                         onChange={this.environmentChanged}
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
                       value={categoryValue}
                       onChange={this.categoryChanged} />

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
                <footer className="p-12 text-right">
                  <button className="btn btn-flat btn-primary"
                    onClick={this.addService}>Add service</button>
                </footer>
              </div>
           </div>);
  }

};

export default AdminServicePanel;
