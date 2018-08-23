import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Basics from "./pages/Basics";
import NoMatch from "./pages/NoMatch";

const App = () => (
  <Router>
    <div>
      <Switch>
        <Route exact path="/" component={Basics}/>
        <Route component={NoMatch}/>
      </Switch>
    </div>
  </Router>
);

export default App;
