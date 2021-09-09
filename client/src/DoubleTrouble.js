import React, { Component } from "react";
import getWeb3 from "./getWeb3";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import CollectionInspector from "./CollectionInspector";
import About from "./About";
import Find from "./Find";
import AllCollections from "./AllCollections";
import { Badge, Spinner, Navbar, Container, Nav, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class DoubleTrouble extends Component {
  constructor() {
    super();
    this.externalCache = {
      web3: null
    };
    this.localState = {};

    this.deriveAndRender();
  };

  componentDidMount() {
    // Listen to Metamask changes and refresh everything
    window.ethereum.on('accountsChanged', this.deriveAndRender);
    window.ethereum.on('chainChanged', this.deriveAndRender);

    window.ethereum.on('disconnected', () => {
      this.localState.error = 'Wallet disconnected. Please reconnect and refresh.'
      this.forceUpdate();
    });
  }

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
    return {web3: await getWeb3()}
  };

  render() {
    return (
        <Router>
          <div>
            <Navbar bg="light" expand="lg">
              <Container>
                <Navbar.Brand href="/">Double Trouble</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="me-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/collections">All collections</Nav.Link>
                    <Button><a style={{textDecoration: "none", color: "white"}} href="/find">Find your NFT</a></Button>
                  </Nav>
                </Navbar.Collapse>
            </Container>
              { this.externalCache.web3 &&
                <Container style={{width: 330}}>
                  <div style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                    Wallet: {this.externalCache.web3.accounts[0]}
                  </div>
                  <Badge className="bg-info">{this.externalCache.web3.chain.name}</Badge>
                </Container>
              }
            </Navbar>
            {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
            <Switch>
              <Route path="/collections/:collection/:tokenId" render={({match}) => {
                return <CollectionInspector web3={this.externalCache.web3}
                  collection={match.params.collection} tokenId={match.params.tokenId} />
              }} />
              <Route path="/collections">
                {
                  this.externalCache.web3
                    ?
                  <AllCollections web3={this.externalCache.web3} />
                    :
                  <Spinner animation="border" />
                }
              </Route>
              <Route path="/find">
                <Find />
              </Route>
              <Route path="/">
                <About />
              </Route>
            </Switch>
          </div>
        </Router>
    );
  }
}

export default DoubleTrouble;
