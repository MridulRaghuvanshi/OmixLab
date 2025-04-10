import { useEffect, useState } from "react"
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai"
import { BsChevronDown } from "react-icons/bs"
import { FiSun, FiMoon } from "react-icons/fi"
import { useSelector } from "react-redux"
import { Link, matchPath, useLocation } from "react-router-dom"
import { useTheme } from "../../context/ThemeContext"

import logo from "../../assets/Logo/Logo-Full-Light.png"
import { NavbarLinks } from "../../data/navbar-links"
import { apiConnector } from "../../services/apiconnector"
import { categories } from "../../services/apis"
import { ACCOUNT_TYPE } from "../../utils/constants"
import ProfileDropdown from "../core/Auth/ProfileDropDown"

function Navbar() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)
  const location = useLocation()
  const { isDarkMode, toggleTheme } = useTheme()

  const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        setSubLinks(res.data.data)
      } catch (error) {
        console.log("Could not fetch Categories.", error)
      }
      setLoading(false)
    })()
  }, [])

  // console.log("sub links", subLinks)

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  return (
    <div
      className={`flex h-16 items-center justify-center border-b-[1px] backdrop-blur-sm sticky top-0 z-50 transition-colors duration-300
        ${isDarkMode 
          ? "border-white/5 bg-[#0A0F1C]/60" 
          : "border-gray-200 bg-white/60"
        } ${location.pathname !== "/" ? "" : "bg-gradient-to-r to-transparent"}`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Logo" width={60} height={32} className="transition-transform duration-300 hover:scale-105" loading="lazy" />
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-8">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                <Link to={link?.path}>
                  <p
                    className={`${
                      matchRoute(link?.path)
                        ? "text-[#00FFB2]"
                        : isDarkMode ? "text-white hover:text-[#00FFB2]" : "text-gray-900 hover:text-[#00FFB2]"
                    } transition duration-300`}
                  >
                    {link.title}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Section: Cart, Login, Theme Toggle */}
        <div className="flex items-center gap-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-1 rounded-full ${
              isDarkMode 
                ? "text-white hover:bg-white/5" 
                : "text-gray-900 hover:bg-gray-100"
            } transition-all duration-200`}
          >
            {isDarkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
          </button>

          {/* Cart Icon */}
          {user && user?.accountType !== ACCOUNT_TYPE.Educator && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className={`text-2xl ${
                isDarkMode ? "text-white" : "text-gray-900"
              } hover:text-[#00FFB2] transition duration-300`} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#00FFB2] text-xs text-[#0A0F1C] font-medium">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {/* Login/Signup Buttons */}
          {token === null && (
            <>
              <Link to="/login">
                <button className="rounded-full px-6 py-2 bg-[#00FFB2] text-[#0A0F1C] font-medium hover:bg-[#00FFB2]/90 transition-all duration-300">
                  Sign in
                </button>
              </Link>
              <Link to="/signup">
                <button className={`rounded-full px-6 py-2 border transition-all duration-300 ${
                  isDarkMode 
                    ? "border-white/10 text-white hover:bg-white/5" 
                    : "border-gray-300 text-gray-900 hover:bg-gray-100"
                }`}>
                  Join Us
                </button>
              </Link>
            </>
          )}

          {/* Profile Dropdown */}
          {token !== null && <ProfileDropdown />}

          {/* Mobile Menu Button */}
          <button className={`${
            isDarkMode ? "text-white" : "text-gray-900"
          } hover:text-[#00FFB2] transition duration-300 md:hidden`}>
            <AiOutlineMenu fontSize={24} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Navbar;