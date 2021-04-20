import React, { useState } from "react"
import cx from "classnames"

import Logo from "../../images/Bonbon.png"

const Header = () => {
  const [openNav, setOpenNav] = useState(false)

  return (
    <nav className="header">
      <img src={Logo} alt="logo image with b" className="logo" />
      <button className="burger" onClick={() => setOpenNav(!openNav)}>
        <div className={cx("box", {open: openNav})}></div>
        <span className={cx("rectangle rectangle--top rectangle--small", {open: openNav})}></span>
        <span className={cx("rectangle rectangle--middle", {open: openNav})}></span>
        <span className={cx("rectangle rectangle--bottom rectangle--small", {open: openNav})}></span>
      </button>
    </nav>
  )
}

export default Header
