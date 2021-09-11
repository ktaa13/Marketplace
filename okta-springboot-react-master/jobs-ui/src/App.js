import React from 'react'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import Keycloak from 'keycloak-js'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import PrivateRoute from './components/misc/PrivateRoute'
import { Dimmer, Header, Icon } from 'semantic-ui-react'
import { Security, SecureRoute, LoginCallback } from '@okta/okta-react'
import { useHistory } from 'react-router-dom';
import Navbar from './components/misc/Navbar'
import Home from './components/home/Home'
import Customer from './components/customer/Customer'
import JobView from './components/customer/JobView'
import Staff from './components/staff/Staff'
import JobForm from './components/staff/JobForm'
import { config } from './Constants'

function App() {
  /* const oktaAuth = new OktaAuth({
    issuer: `${process.env.REACT_APP_OKTA_ORG_URL}/oauth2/default`,
    clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
    redirectUri: `${window.location.origin}/implicit/callback`
  }) */
  
  const keycloak = new Keycloak({
    url: `${config.url.KEYCLOAK_BASE_URL}/auth`,
    realm: "company-services",
    clientId: "movies-app"
  })
  const initOptions = { pkceMethod: 'S256' }

  /*  const history = useHistory();
  const restoreOriginalUri = async (_keycloak, originalUri) => {
    history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
  };  */
  
/*   const handleOnEvent = async (event, error) => {
    if (event === 'onAuthSuccess') {
      if (keycloak.authenticated) {
        let response = await moviesApi.getUserExtrasMe(keycloak.token)
        if (response.status === 404) {
          const userExtra = { avatar: keycloak.tokenParsed.preferred_username }
          response = await moviesApi.saveUserExtrasMe(keycloak.token, userExtra)
          console.log('UserExtra created for ' + keycloak.tokenParsed.preferred_username)
        }
        keycloak['avatar'] = response.data.avatar
      }
    }
  } */

  const loadingComponent = (
    <Dimmer inverted active={true} page>
      <Header style={{ color: '#4d4d4d' }} as='h2' icon inverted>
        <Icon loading name='cog' />
        <Header.Content>Keycloak is loading
          <Header.Subheader style={{ color: '#4d4d4d' }}>or running authorization code flow with PKCE</Header.Subheader>
        </Header.Content>
      </Header>
    </Dimmer>
  )

  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={initOptions}
      LoadingComponent={loadingComponent}
      //onEvent={(event, error) => handleOnEvent(event, error)}
    >
      <Router>
        <Navbar />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/login' component={Home} />
          <Route path='/implicit/callback' component={LoginCallback} />
          <PrivateRoute path='/customer' exact component={Customer} />
          <PrivateRoute path='/staff' exact component={Staff} />
          <PrivateRoute path='/jobs/:job_id' component={JobView} />
          <PrivateRoute path='/staff/jobs' exact component={JobForm} />
          <PrivateRoute path='/staff/jobs/:job_id' component={JobForm} />
          <Route component={Home} />
        </Switch>
      </Router>
    </ReactKeycloakProvider>
  )

  /* (
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri} >
      <div className="App">
        <Navbar />
        <Route path='/' exact component={Home} />
        <Route path='/login' exact component={Home} />
        <SecureRoute path='/customer' exact component={Customer} />
        <SecureRoute path='/staff' exact component={Staff} />
        <SecureRoute path='/jobs/:job_id' component={JobView} />
        <SecureRoute path='/staff/jobs' exact component={JobForm} />
        <SecureRoute path='/staff/jobs/:job_id' component={JobForm} />
        <Route path='/implicit/callback' component={LoginCallback} />
      </div>
    </Security>
  ) */

  
}

export default App
