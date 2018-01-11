// @flow
import React from 'react';

import MainContent from './MainContent';

import WelcomeComponent from './WelcomeComponent';

class App extends React.Component<{}> {

  render() {
    return(
      <div id='appFrame' className="maxHeight">
        <WelcomeComponent userName='Oleg Kleiman'/>
        <MainContent />
      </div>
    );
  }

}

export default App;
