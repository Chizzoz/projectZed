import React, { Component } from 'react'
import firebase from './config/firebase'
import Card from './components/Card'
import Navbar from './components/Navbar'
import SigninModal from './components/Modals/SigninModal'

import { connect } from 'react-redux'
import { loadProjects, logInStateChange } from './actions/actionCreators'
import './App.scss'

// TODO: remove the line below
firebase.auth().signInAnonymously()
class App extends Component {
  componentDidMount () {
    // this.props.dispatch(loadProjects())
    this.checkLoggedInUser()
  }

  componentWillUnmount () {
    firebase.auth().signOut()
    this.props.dispatch(({ userUID: null, userLoggedIn: false }))
  }

checkLoggedInUser = () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      this.props.dispatch(logInStateChange({ userUID: user.uid, loggedIn: true }))
    } else {
      this.props.dispatch(logInStateChange({ userUID: null, loggedIn: false }))
    }
  })
}

authenticate = provider => {
  const authProvider = new firebase.auth[`${provider}AuthProvider`]()
  firebase.auth().signInWithPopup(authProvider)
    .then(this.authHandler)
    .catch(function (error) {
      console.log(error)
    })
}

authHandler = async authData => {
  console.log(authData)
}

render () {
  const { projects } = this.props
  const { signinModalOpen } = this.props.home
  if (projects && projects.length !== 0) {
    return (
      <div style={{ backgroundColor: '#000' }}>
        <Navbar/>
        {/* landing page */}
        <div style={{ height: '100vh' }}>
          <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '70%', textAlign: 'center' }}>
            <div>
              <p style={{ fontSize: 60, color: '#FFF', float: 'center' }}>Project Zed</p>
            </div>
            <p style={{ fontSize: 40, color: '#FFF', float: 'center', marginLeft: '20px' }}>
              Find projects done by Zambian Developers
            </p>
            <div className="arrow bounce">
              <a className="fa fa-arrow-down fa-2x downArrow" href="#projects"></a>
            </div>
          </div>
        </div>
        <div id='projects'>
          { projects ? projects.map((project, i) =>
            <Card key={i} index={i} project= {project} />) : null
          }
        </div>
        <SigninModal isOpen={signinModalOpen} />
      </div>
    )
  }
  return (
    <div style={{ height: '100vh', backgroundColor: '#000' }}
      className=" row justify-content-center align-items-center">
      <div className="loader" />
    </div>
  )
}
}

// this receives the state. it has a property 'projectsReducer' so we destructure here
function mapStateToProps ({ projectsReducer, homeReducer }) {
  return {
    projects: projectsReducer,
    home: homeReducer
  }
}

export default connect(mapStateToProps, null)(App)
