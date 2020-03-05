import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"


const Layout = ({ children }) => {
  return (
    <>
     <div className="text-gray-800 bg-white dark:bg-gray-900 dark:text-white leading-normal flex flex-col min-h-screen">
    <header className="">
        <nav className="nav h-20 flex flex-wrap items-center justify-between px-4">
      <div className="flex flex-no-shrink items-center mr-6 py-3 text-purple-450">
        <a href="/"><h1 className="font-ram text-3xl  mr-2 text-purple-450 font-bold"> &lt;B /&gt;</h1></a>
      </div>

      <input className="menu-btn hidden" type="checkbox" id="menu-btn" />
      <label className="menu-icon block cursor-pointer md:hidden px-2 py-4 relative select-none" htmlFor="menu-btn">
        <span className="navicon bg-gray-darkest flex items-center relative"></span>
      </label>

      <ul className="menu border-b md:border-none flex justify-end list-reset m-0 w-full md:w-auto">
        <li className="border-t md:border-none">
          <Link to="/" activeClassName="text-purple-450 dark:text-purple-400" className="block md:inline-block px-4 py-3 no-underline dark:text-white hover:text-purple-450 dark:hover:text-purple-400 font-bold">Home</Link>
        </li>
        
        <li className="border-t md:border-none">
          <Link activeClassName="text-purple-450 dark:text-purple-400" to="/resume/" className="block md:inline-block px-4 py-3 no-underline dark:text-white hover:text-purple-450 dark:hover:text-purple-400 font-bold">Resume</Link>
        </li>
        
        <li className="border-t md:border-none">
          <Link activeClassName="text-purple-450 dark:text-purple-400" to="/blog/" className="block md:inline-block px-4 py-3 no-underline dark:text-white hover:text-purple-450 dark:hover:text-purple-400 font-bold">Blog</Link>
        </li>
      </ul>
    </nav>
    </header>
    <div className="flex-grow">
      <main>{children}</main>
    </div>
    <footer className="bg-purple-450 dark:bg-purple-700 text-white">
      <div className="container mx-auto flex items-center justify-between py-8">
        <div>copyright 2020. All rights reserved</div>
        <ul className="flex items-center">
          {/* <li className="mr-8">
            <a href="#">A</a>
          </li>
          <li className="mr-8">
            <a href="#">A</a>
          </li>
          <li className="mr-8">
            <a href="#">A</a>
          </li>
          <li className="mr-8">
            <a href="#">A</a>
          </li>
          <li className="mr-8">
            <a href="#">A</a>
          </li> */}
        </ul>
      </div>
    </footer>
  </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
