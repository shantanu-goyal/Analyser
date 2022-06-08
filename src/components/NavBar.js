import React, { useRef } from "react";
import { NavLink } from "react-router-dom";
import '../styles/NavBar.css';




export const NavBar = function () {

  const navRef = useRef(null);

  function handleNavItemClick(e) {
    e.preventDefault();
    if (navRef.current.className === "topnav") {
      navRef.current.className += " responsive";
    } else {
      navRef.current.className = "topnav";
    }
  }

  const navLinkStyles = ({ isActive }) => {
    return {
      fontWeight: isActive ? 'bold' : 'normal'
    }
  }

  return (
    <div ref={navRef} className="topnav" id="myTopNav">
      <NavLink style={navLinkStyles} to='/'>Home</NavLink>
      <NavLink style={navLinkStyles} to='/bootup-time'>Bootup Time</NavLink>
      <NavLink style={navLinkStyles} to='/mainthread-work-breakdown'>Main Thread Work BreakDown</NavLink>
      <NavLink style={navLinkStyles} to='/network-requests'>Network Requests</NavLink>
      <NavLink style={navLinkStyles} to='/network-rtt'>Network RTT</NavLink>
      <NavLink style={navLinkStyles} to='/network-server-latency'>Network Server Latency</NavLink>
      <NavLink style={navLinkStyles} to='/resource-summary'>Resource Summary</NavLink>
      <NavLink style={navLinkStyles} to='/third-party-summary'>Third Party Summary</NavLink>
      <NavLink style={navLinkStyles} to='#' className="icon" onClick={handleNavItemClick}><i className="fa fa-bars"></i></NavLink>
    </div>
  )
}

