import React from "react";
import { Link } from "gatsby";
import AniLink from "gatsby-plugin-transition-link/AniLink"
import Logo from "../images/logo";

export default ({ color }) => {
  return (
    <header className="w-11/12 mx-auto">
      <nav className="nav h-20 flex flex-wrap items-center justify-between px-4">
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
            <a 
            href='https://resume.io/r/5vWttCoMY'
            target="_blank"
            rel="noopener noreferrer"
            className="block md:inline-block px-4 py-3 no-underline dark:text-white hover:text-purple-450 dark:hover:text-purple-400 font-bold"
            >
              Resume
            </a>
          </li>

          <li className="border-t md:border-none">
            <AniLink
              cover
              activeClassName="text-purple-450 dark:text-purple-400"
              to="/blog/"
              className="block md:inline-block px-4 py-3 no-underline dark:text-white hover:text-purple-450 dark:hover:text-purple-400 font-bold"
            >
              Blog
            </AniLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}
