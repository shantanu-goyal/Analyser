import React from "react";
import { NavLink } from "react-router-dom";
import '../styles/NavBar.css';


export const NavBar = function () {
  const navLinkStyles = ({ isActive }) => {
    return {
      fontWeight: isActive ? 'bold' : 'normal',
      textDecoration: isActive ? 'none' : 'underline'
    }
  }

  return (
    <nav className="primary-nav">
      <NavLink style={navLinkStyles} to='/bootup-time'>Bootup Time</NavLink>
      <NavLink style={navLinkStyles} to='/mainthread-work-breakdown'>Main Thread Work BreakDown</NavLink>
      <NavLink style={navLinkStyles} to='/network-requests'>Network Requests</NavLink>
      <NavLink style={navLinkStyles} to='/network-rtt'>Network RTT</NavLink>
      <NavLink style={navLinkStyles} to='/network-server-latency'>Network Server Latency</NavLink>
      <NavLink style={navLinkStyles} to='/resource-summary'>Resource Summary</NavLink>
      <NavLink style={navLinkStyles} to='/third-party-summary'>Third Party Summary</NavLink>
    </nav >
  )
}

