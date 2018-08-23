import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Basics from "./pages/Basics";
// import Detail from "./pages/Detail";
import NoMatch from "./pages/NoMatch";
// import Nav from "./components/Nav";

const App = () => (
  <Router>
    <div>
      {/* <Nav /> */}
      <Switch>
        <Route exact path="/" component={Basics}/>
        {/* <Route exact path="/basics" component={Basics}/>
        <Route exact path="/basics/:id" component={Detail}/> */}
        <Route component={NoMatch}/>
      </Switch>
    </div>
  </Router>
);

export default App;
