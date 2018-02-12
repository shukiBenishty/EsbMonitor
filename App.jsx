import React from 'react';

import Navigation from './Navigation';
import Header from './Header';
import MainContent from './MainContent';
import Footer from './Footer';

class AppLayout extends React.Component {

  render() {
    return (<div className="maxHeight">
              <Navigation />
              <Header userName='Oleg Kleiman'/>
              <MainContent />
            </div>);
  }

};

export default AppLayout;
