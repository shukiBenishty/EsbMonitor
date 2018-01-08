// @flow
import React from 'react';

import WelcomeComponent from './WelcomeComponent';
import EventList from './EventList';

class App extends React.Component<{}> {

  componentDidMount() {
  }

  render() {
    return(
      <div id='appFrame' className="maxHeight">
        <WelcomeComponent userName='Oleg Kleiman'/>
        <EventList />
      </div>
    );
  }

}

export default App;
