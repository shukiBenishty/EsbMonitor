// @flow
import React from 'react';
import environemnt from './Environment';
import { createFragmentContainer, graphql } from 'react-relay';
import Select from 'react-select';
import EsbTestCategory from './EsbTestCategory';

type Props = {
};

type State = {
  selectedCategory: Object
}

class EsbTestCategories extends React.Component<Props, State> {

  constructor(props) {
    super(props);

    this.state = {
      selectedCategory: {}
    }
  }

  _updateCategory(newCategory) {
    console.log('Category selected: ' + newCategory);
  }

  render() {

    const { selectedCategory } = this.state;
    const _value = selectedCategory && selectedCategory.value;

    let _categories = this.props.categories;

    return (<div>
    {
      _categories.map( category => {
          return <EsbTestCategory category={category} />;
          // return {
          //   value: category.id,
          //   label: category.name
          // }
      })
    }
    </div>);

    // return (<Select
    //               className='categoriesSelector'
    //               name="categoriesSelector"
    //               placeholder="Select category"
    //               options={normalizedCategories}
    //               value={_value}
    //               onChange={this._updateCategory}
    //           />);
  }

}


export default createFragmentContainer(EsbTestCategories,
graphql`
  fragment EsbTestCategories_categories on Category @relay(plural: true) {
    ...EsbTestCategory_category
  }
`);
