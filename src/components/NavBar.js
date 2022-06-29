import { useRef } from "react";
import { NavLink } from "react-router-dom";
import '../styles/NavBar.css';

/**
* Function to create JSX of navbar element
* @returns navbar jsx
*/
export const NavBar = function () {
  // Referencing the navbar element
  const navRef = useRef(null);
  // Function to handle the click event of the navbar
  function handleNavItemClick(e) {
    // The page won't reload when the button is clicked. `e.preventDefault()` prevents this. 
    e.preventDefault();
    if (navRef.current.className === "topnav") {
      navRef.current.className += " responsive";
    } else {
      navRef.current.className = "topnav";
    }
  }

  /**
   * Generate style for nav link conditionally
   * @param {Boolean} isActive whether the navlink is active 
   * @returns style for a nav link
   */
  const navLinkStyles = ({ isActive }) => {
    // If the nav item has an active class, then the font is bold
    return {
      fontWeight: isActive ? 'bold' : 'normal'
    }
  }

  return (
    <div ref={navRef} className="topnav" id="myTopNav">
      <NavLink style={navLinkStyles} to='/'>Home</NavLink>
      <NavLink style={navLinkStyles} to='/third-party-summary'>Third Party Summary</NavLink>
      <NavLink style={navLinkStyles} to='/insights'>Insights</NavLink>
      <NavLink style={navLinkStyles} to='/network-requests'>Network Requests</NavLink>
      <NavLink style={navLinkStyles} to='/network-map'>Network Map</NavLink>
      <NavLink style={navLinkStyles} to='/bootup-time'>Bootup Time</NavLink>
      <NavLink style={navLinkStyles} to='/mainthread-work-breakdown'>Main Thread Work BreakDown</NavLink>
      
      {/* <NavLink style={navLinkStyles} to='/network-rtt'>Network RTT</NavLink>
      <NavLink style={navLinkStyles} to='/network-server-latency'>Network Server Latency</NavLink> */}
      <NavLink style={navLinkStyles} to='/resource-summary'>Resource Summary</NavLink>
      <NavLink style={navLinkStyles} to='#' className="icon" onClick={handleNavItemClick}>
        <div className="bar-container">
          <div className="bars"></div>
          <div className="bars"></div>
          <div className="bars"></div>
        </div>
      </NavLink>
    </div>
  )
}

