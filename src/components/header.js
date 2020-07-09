/** @jsx jsx */
import { jsx } from 'theme-ui'
// import { Link } from "gatsby"
import PropTypes from "prop-types"
// import React from "react"

function Header({ siteTitle }) {
  return (
  <header
    sx={styles.header}
  >
   <nav sx={styles.nav}>
     <ul sx={styles.navLeft}>
       <li>Logo</li>
       <li>Blog</li>
       <li>About</li>
       <li>Contact</li>
     </ul>
     <ul sx={styles.navRight}>
       <li>Search</li>
       <li>Twitter</li>
     </ul>
   </nav>
  </header>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header

const styles = {
  header: {
    height: '6rem',
    boxShadow: '0 2px 20px 0 rgba(0,0,0,0.1)',
  },
  nav: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navLeft: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flex: '1',
  },
  navRight: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
}
