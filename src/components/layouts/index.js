import React from "react";
import PropTypes from "prop-types";
import Header from './header';
import Footer from './footer';
import './style.css';


const Layout = ({ children }) => {
  return (
    <>
     <div className="body">
    <Header />
    <div className="main">
      <main>{children}</main>
    </div>
    <Footer />
  </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout;
