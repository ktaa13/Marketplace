import React, { Component, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { withKeycloak } from '@react-keycloak/web'
import { useKeycloak } from '@react-keycloak/web'
import { withOktaAuth } from '@okta/okta-react'
import M from 'materialize-css'

function Navbar (props) {

  const { keycloak } = useKeycloak()

  const handleLogInOut = () => {
    if (keycloak.authenticated) {
      //props.history.push('/')
      keycloak.logout()
    } else {
      keycloak.login()
    }
  }

  const checkAuthenticated = () => {
    if (!keycloak.authenticated) {
      handleLogInOut()
    }
  }

  const getUsername = () => {
    return keycloak.authenticated && keycloak.tokenParsed && keycloak.tokenParsed.preferred_username
  }

  const getLogInOutText = () => {
    return keycloak.authenticated ? "Logout" : "Login"
  }

  /* const getAdminMenuStyle = () => {
    return keycloak.authenticated && isAdmin(keycloak) ? { "display": "block" } : { "display": "none" }
  } */

  /* async componentDidMount() {
    
    this.checkAuthentication()

    const sidenav = document.querySelectorAll('.sidenav')
    M.Sidenav.init(sidenav)
  }

  async componentDidUpdate() {
    this.checkAuthentication()
  } */
   /* checkAuthentication = async () => {
    if (this.props.authState) {
      const authenticated = await this.props.authState.isAuthenticated
      if (authenticated !== this.state.authenticated) {
        const user = await this.props.oktaAuth.getUser()
        this.setState({ authenticated, user })
      }
    }
  }  */


  /* logHandleLogInOut = async () => {
    this.state.authenticated ? this.props.oktaAuth.signOut('/') : this.props.oktaAuth.signInWithRedirect('/')
  } */


    const linkVisibility = keycloak.authenticated ? { "display": "block" } : { "display": "none" }
    //const username = keycloak.authenticated && this.state.user.preferred_username 
    const logInOut = keycloak.authenticated ? "Logout" : "Login"
    return (
      <div>
        <div className="navbar-fixed">
          <nav className="light-blue darken-4">
            <div className="nav-wrapper container">
              <Link to="/" className="brand-logo">Jobs Portal</Link>
              <a href="/" data-target="mobile-menu" className="sidenav-trigger">
                <i className="material-icons">menu</i>
              </a>
              <ul id="nav" className="right hide-on-med-and-down">
                {/* <li>{username}</li> */}
                <li><NavLink exact to="/">Home</NavLink></li>
                <li><NavLink exact to="/customer" style={linkVisibility}>Customer</NavLink></li>
                <li><NavLink exact to="/staff" style={linkVisibility}>Staff</NavLink></li>
                <li><NavLink exact to="/login" onClick={handleLogInOut}>{logInOut}</NavLink></li>
              </ul>
            </div>
          </nav>
        </div>

        <ul id="mobile-menu" className="sidenav">
          <li><Link to="/" className="sidenav-close">Home</Link></li>
          <li><Link to="/customer" className="sidenav-close">Customer</Link></li>
          <li><Link to="/staff" className="sidenav-close">Staff</Link></li>
          <li><Link to="/" onClick={handleLogInOut}>{logInOut}</Link></li>
        </ul>
      </div>
    )
  }



export default withKeycloak(Navbar)