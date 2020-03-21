import React from "react";
import { Link } from "gatsby";
import Logo from "../images/logo";
// import logo from '../../images/Bonbon.png'

export default () => {
  return (
    <header className="">
      <nav className="nav h-16 flex flex-wrap items-center justify-between px-4">
        <div className="flex flex-no-shrink items-center">
          <Link className='logo' to="/">
            <Logo />
          </Link>
        </div>

        <input className="menu-btn hidden" type="checkbox" id="menu-btn" />
        <label
          className="menu-icon block cursor-pointer md:hidden px-2 py-4 relative select-none"
          htmlFor="menu-btn"
        >
          <span className="navicon bg-gray-darkest flex items-center relative"></span>
        </label>

        <ul className="menu border-b md:border-none flex justify-end list-reset m-0 w-full md:w-auto">
          <li className="border-t md:border-none">
            <Link
              to="/"
              activeClassName="text-purple-450 dark:text-purple-400"
              className="block md:inline-block px-4 py-3 no-underline dark:text-white hover:text-purple-450 dark:hover:text-purple-400 font-bold"
            >
              Home
            </Link>
          </li>

          <li className="border-t md:border-none">
            <Link
              activeClassName="text-purple-450 dark:text-purple-400"
              to="/resume/"
              className="block md:inline-block px-4 py-3 no-underline dark:text-white hover:text-purple-450 dark:hover:text-purple-400 font-bold"
            >
              Resume
            </Link>
          </li>

          <li className="border-t md:border-none">
            <Link
              activeClassName="text-purple-450 dark:text-purple-400"
              to="/blog/"
              className="block md:inline-block px-4 py-3 no-underline dark:text-white hover:text-purple-450 dark:hover:text-purple-400 font-bold"
            >
              Blog
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
