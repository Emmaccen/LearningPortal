import React from 'react';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Content from './components/Content'
import Topic from './components/Topic'
import Home from './components/Home'

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

 // Your web app's Firebase configuration
 var firebaseConfig = {
  apiKey: "AIzaSyAp-SRKzgn00MHLuKUcVmW0ZQh7y6d1CQM",
  authDomain: "devlookup.firebaseapp.com",
  databaseURL: "https://devlookup.firebaseio.com",
  projectId: "devlookup",
  storageBucket: "devlookup.appspot.com",
  messagingSenderId: "678115646940",
  appId: "1:678115646940:web:c583dc9441375a21eb8319",
  measurementId: "G-XR9291PGMY"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();


function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path='/' exact component={Home}></Route>
          <Route path='/Content' exact component={Content}></Route>
          <Route path='/Content/Topic/:id' exact component={Topic}></Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;