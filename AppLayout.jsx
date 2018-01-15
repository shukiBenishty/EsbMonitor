import React from 'react';

import Navigation from './Navigation';
import WelcomeComponent from './WelcomeComponent';
import MainContent from './MainContent';

class AppLayout extends React.Component {

  render() {
    return (<div className="maxHeight">
              <Navigation />
              <WelcomeComponent userName='Oleg Kleiman'/>
              <MainContent />
            </div>);
  }

};

export default AppLayout;
