import React from 'react';
import { createFragmentContainer, createRefetchContainer, graphql } from 'react-relay';

const EsbTestCategory = ({category}) => {

  return (<div>
            {category.name}
          </div>);

};

// class EsbTestCategory extends React.Component {
//
//   constructor(props) {
//     super(props);
//
//     this.styles = {
//       container: {
//         display: "flex"
//       }
//     }
//   }
//
//   render() {
//
//     let category = this.props.category;
//
//     return (<div style={this.styles.container}>
//               <div>{category.name}({category.id})</div>
//             </div>);
//   }
// };

export default createFragmentContainer(EsbTestCategory,
  graphql`
    fragment EsbTestCategory_category on Category {
      id
      name
    }
  `
)
