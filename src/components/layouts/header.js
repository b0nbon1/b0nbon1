import React from "react";
import AniLink from "gatsby-plugin-transition-link/AniLink"
import Logo from "../images/logo";

export default ({ color }) => {
  return (
    <header className="w-11/12 mx-auto bg-transparent">
      <nav className="h-20 flex  flex-row items-center justify-between px-4">
        <div className="flex flex-no-shrink items-center">
          <AniLink cover direction='right'  className='logo' to="/">
            <Logo />
          </AniLink>
        </div>

        <ul className="flex justify-end m-0 w-full md:w-auto items-center">
          <li>
            <AniLink
              direction='right'
              cover
              to="/"
              activeClassName="text-purple-450 dark:text-purple-400"
              className="block md:inline-block px-4 py-3 no-underline dark:text-white hover:text-purple-450 dark:hover:text-purple-400 font-bold"
            >
              About
            </AniLink>
          </li>

          <li>
            <AniLink
              cover
              activeClassName="text-purple-450 dark:text-purple-400"
              to="/blog/"
              className="block md:inline-block px-4 py-3 no-underline dark:text-white hover:text-purple-450 dark:hover:text-purple-400 font-bold"
            >
              Blogs
            </AniLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}
