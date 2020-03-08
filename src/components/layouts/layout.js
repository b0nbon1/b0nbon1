import React from "react"
import PropTypes from "prop-types"
import Header from './header';
import Footer from './footer';


const Layout = ({ children }) => {
  return (
    <>
     <div className="text-gray-800 bg-white dark:bg-gray-900 dark:text-white leading-normal flex flex-col min-h-screen">
    <Header />
    <div className="flex-grow">
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

export default Layout
