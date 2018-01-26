import React from 'react';
import { createFragmentContainer, createRefetchContainer, graphql } from 'react-relay';

class EsbTestCategory extends React.Component {

  constructor() {
    super();

    this.styles = {
      container: {
        display: "flex"
      }
    }

    this._refetch = this._refetch.bind(this);
  }

  _refetch() {
    console.log(this.props.category.id);

    this.props.relay.refetch(
      {id: this.props.category.id},
      null,
      () => {console.log('Refetched')},
      {force: true}
    )
  }

  render() {

    let category = this.props.category;

    return (<div style={this.styles.container}>
              <div>{category.name}({category.id})</div>
              <button onClick={this._refetch}>Refresh</button>
            </div>);

  }

};

// export default createFragmentContainer(EsbTestCategory,
// graphql`
//   fragment EsbTestCategory_category on Category {
//     name
//     id
//   }
// `);

export default createRefetchContainer(EsbTestCategory,
  graphql`
    fragment EsbTestCategory_category on Category {
      name
      id
    }
  `,
  graphql`
    query EsbTestCategory_Query($id: ID!) {
      category(id: $id) {
        ...EsbTestCategory_category
      }
    }
  `)
