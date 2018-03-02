import React from 'react';

const Footer = () => {

  return (
    <footer className="site-footer">
      <div className="row">
        <div className="col-md-6">
          <p className="text-center text-md-left">
            Copyright (c) 2018
            <a href="#">TLV Municipality</a>
            .All right reserved.
          </p>
        </div>
        <div className="col-md-6">
          <ul className="nav nav-primary nav-dotted nav-dot-separated">
            <li className="nav-item">
                <a href="#" className="nav-link">Documentation</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );

}

export default Footer;
