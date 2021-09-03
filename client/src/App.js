import React, { Component } from "react";
import getWeb3 from "./getWeb3";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import CollectionInspector from "./CollectionInspector";
import doubleTroubleOrchestrator from './orchestrator';

class App extends Component {
  constructor() {
    super();
    this.externalCache = {
      web3: null
    };

    this.deriveAndRender();
  };

  deriveAndRender = () => {
    this.deriveExternalCache().then((ret) => {
      this.externalCache = ret;
      this.forceUpdate();
    }).catch((err) => {
      console.error(err);
      this.localState.error = err.message;
      this.forceUpdate();
    });
  };

  deriveExternalCache = async () => {
    const web3 = await getWeb3();
    return {web3}
  };

  render() {
    return (
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/collections/0xdeadbeef/1234">NFT</Link>
              </li>
            </ul>
          </nav>
          {this.externalCache.web3 && <div>Connected wallet: {this.externalCache.web3.defaultAccount}</div>}

          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/about">
              <div>We are cool</div>
            </Route>
            <Route path="/collections/:collection/:tokenId" render={({match}) => {
              return <CollectionInspector web3={this.externalCache.web3}
                collection={match.params.collection} tokenId={match.params.tokenId} />
            }} />
            <Route path="/">
              <div>Home</div>
            </Route>
            <Route path="/collections">
              <AllCollections web3={this.externalCache.web3} />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

class AllCollections extends Component {
  constructor() {
    super();
    this.externalCache = {};

    this.deriveAndRender();
  };

  deriveAndRender = () => {
    this.deriveExternalCache().then((ret) => {
      this.externalCache = ret;
      this.forceUpdate();
    }).catch((err) => {
      console.error(err);
      this.localState.error = err.message;
      this.forceUpdate();
    });
  };

  deriveExternalCache = async () => {
    const dto = await doubleTroubleOrchestrator(this.props.web3);
    return {}
  };

  render() {
    return (
      <div>
      </div>
    );
  }
}

export default App;
