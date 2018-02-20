// @flow
import React from 'react';
import { requestSubscription, createRefetchContainer, commitMutation, graphql } from 'react-relay';
import { AutoSizer, List } from 'react-virtualized';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import { css } from 'glamor';
import classNames from 'classnames';
import TextField from 'material-ui/TextField';

import EsbService from './EsbService';
import EsbServiceRequest from './EsbServiceRequest';
import AdminServicePanel from './AdminServicePanel';
import environment from './Environment';

 const addServiceMutation = graphql`
   mutation EsbAdminMutation(
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

 const deleteServiceRequestSubscription = graphql`
   subscription EsbAdmin_ServiceRequestDeleted_Subscription {
     serviceRequestDeleted {
       id
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
      categories: [],
      currentServicesPage: 1,
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
    }

    this._openServicePanel = this._openServicePanel.bind(this);
    this._closeServicePanel = this._closeServicePanel.bind(this);
    this._updateCategory = this._updateCategory.bind(this);

    this.pageClicked = this.pageClicked.bind(this);

    this.rowRenderer = this.rowRenderer.bind(this);
    this.rowRequestRenderer = this.rowRequestRenderer.bind(this);

    this._serviceAdding = this._serviceAdding.bind(this);
    this._serviceAdded = this._serviceAdded.bind(this);
  }

  componentDidMount() {

    const subscriptionConfig = {
      subscription: deleteServiceRequestSubscription,
      variables: {},
      updater: (proxyStore: RecordSourceSelectorProxy) => {

        const payloadProxy = proxyStore.getRootField('serviceRequestDeleted');
        const _id = payloadProxy.getValue('id');

        proxyStore.delete(_id);
      }
    };

    let subscription = requestSubscription(
      environment,
      subscriptionConfig
    );
  }

  _serviceAdding() {
      this.toastId = toast("Adding Service to Repository", { autoClose: false});
  }

  _serviceAdded({isAdded, message}) {

    if( isAdded ) {
      toast.update(this.toastId,
                    {
                      render: message,
                      type: toast.TYPE.SUCCESS,
                      autoClose: 3000,
                      className: css({
                        transform: "rotateY(360deg)",
                        transition: "transform 0.6sec"
                      })
                    });

    } else {
      toast.update(this.toastId,
                    {
                      render: message,
                      type: toast.TYPE.ERROR,
                      autoClose: 5000,
                    }
                  );
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

    let _services = this.props.repository.services.list;

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

    let requests = this.props.repository.serviceRequests
                   .filter( sReq => sReq != null);

    return <EsbServiceRequest key={index}
                              serviceRequest={requests[index]} />

  }

  render() {

    let _categories = this.props.categories.map( (category, index) => {
        return {
          value: category.objectId,
          label: category.name
        }
    })

    let _services = this.props.repository.services.list;
    let totalServices = this.props.repository.services.totalItems;

    var servicePanelClass = classNames('quickview', 'quickview-lg', {
       'reveal': this.state.servicePanelVisible
    });

    const { selectedCategory } = this.state;
    const _value = selectedCategory && selectedCategory.value;

    let _serviceRequests = this.props.repository.serviceRequests
                           .filter( sReq => sReq != null );

    return (<main className="main-container maxHeight">
                <ToastContainer />
                <div className="main-content maxHeight">
                  <div className="media-list media-list-divided media-list-hover maxHeight">
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

                      <div className="col-lg-9 tab-content maxHeight">
                        <div className="card tab-pane maxHeight fade in active show" id="tab1">
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

                                <List className="esbRepositoryList"
                                  ref={ c => { this.vServicesList = c; }}
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

                                  <List className="esbRepositoryList"
                                    ref={ c => { this.vServiceRequestList = c; }}
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
                  <AdminServicePanel onClose={this._closeServicePanel}
                                     onServiceAdding={this._serviceAdding}
                                     onServiceAdded={this._serviceAdded}
                                     categories={_categories} />
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
      totalItems
      list {
        ...EsbService_service
      }
    }
    serviceRequests {
      ...EsbServiceRequest_serviceRequest
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
