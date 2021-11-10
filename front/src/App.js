import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "../src/pages/Home";
import Board from "../src/pages/Board";
import Detail from "../src/pages/Detail";
import MyPage from "../src/pages/MyPage";
import GlobalStyles from "./GlobalStyles";

function App() {
  return (
    <>
      <BrowserRouter>
        <GlobalStyles />
        {/* <ScrollToTop> */}
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/board" component={Board} />
          <Route exact path="/detail/:id" component={Detail} />
          <Route exact path="/myPage" component={MyPage} />
        </Switch>
        {/* </ScrollToTop> */}
      </BrowserRouter>
    </>
  );
}

export default App;
