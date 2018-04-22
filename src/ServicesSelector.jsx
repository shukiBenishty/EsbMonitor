// @flow
import React from 'react';
import { createRefetchContainer, graphql } from 'react-relay';
import Select from 'react-select';

import EsbServices from './EsbServices';

type Props = {
  categories: Array<{
    name: string,
    objectId: number
  }>
};

type State = {
  selectedCategory: Object
}

class ServicesSelector extends React.Component<Props, State> {

  constructor(props) {
    super(props);

    this.state = {
      selectedCategory: null,
      refetcher: props.refetcher
    }

    this.categoryChanged = this.categoryChanged.bind(this);
  }

  servicesChanged = (services) => {

    if( this.state.refetcher ) {
      this.state.refetcher(services);
    }
  }

  categoryChanged = (newCategory) => {

    this.setState({
      selectedCategory: newCategory
    });

    let variables = {
      categoryId: newCategory.value
    }

    this.props.relay.refetch(
      variables,
      null,
      () => {
        console.log('Refetch done');
      },
      {force: false}
    );

  }

  render() {

    let services = this.props.services.services;
    let categories = this.props.categories.map( category => {
      return {
        value: category.objectId,
        label: category.name
      }
    });

    const { selectedCategory } = this.state;
    const _value = selectedCategory && selectedCategory.value;

    return <div className='row justify-content-center'>

              <Select
                className='col-2 align-self-center'
                placeholder="Select services' group"
                options={categories}
                value={_value}
                onChange={this.categoryChanged}
              />

              <EsbServices
                  selectedServices = "4,5"
                  className='col-10 align-self-center'
                  disabled={!this.state.selectedCategory}
                  services={services}
                  onChange={this.servicesChanged}
              />
           </div>
  }

}

export default createRefetchContainer(ServicesSelector,
graphql`
  fragment ServicesSelector_services on Repository
  @argumentDefinitions(
    categoryId: { type: Int }
  )
  {
    services(categoryId: $categoryId) {
      list{
        objectId
        name
      }
    }
  }
`,
graphql`
  query ServicesSelector_Query ($categoryId: Int) {
    repository {
      ...ServicesSelector_services @arguments(categoryId: $categoryId)
    }
  }
`);
