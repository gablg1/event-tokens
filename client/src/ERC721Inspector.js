import React, { Component } from "react";
import doubleTroubleOrchestrator from './orchestrator';
import GenericNFTContract from "./contracts/IERC721Metadata.json";
import { Card, Button, Spinner } from "react-bootstrap";

const ZERO_ADDR = "0x0000000000000000000000000000000000000000";

class ERC721Inspector extends Component {
  constructor() {
    super();
    this.localState = {error: undefined, imgSrc: null};
    this.externalCache = {
      web3: null, accounts: null, defaultAccount: null,
      dto: undefined, troublesomeCollection: undefined,
    };
  };

  componentDidMount() {
    this.deriveAndRender();
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.deriveAndRender();
    }
  };

  refreshPage = () => {
    window.location.reload();
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
    if (!this.props.web3) {
      return {};
    }

    const dto = await doubleTroubleOrchestrator(this.props.web3);

    const nftCollection = new this.props.web3.eth.Contract(
      GenericNFTContract.abi,
      this.props.collection,
    );

    var troublesomeCollection;
    try {
      troublesomeCollection = await dto.methods.troublesomeCollection(this.props.collection).call();
    } catch(err) {
      throw new Error(`Unable to connect to DoubleTroubleOrchestrator`);
    }
    const collectionName = await nftCollection.methods.name().call();
    const collectionSymbol = await nftCollection.methods.symbol().call();


    var nftOwner, tokenURI;
    try {
      nftOwner = await nftCollection.methods.ownerOf(this.props.tokenId).call();
      tokenURI = await nftCollection.methods.tokenURI(this.props.tokenId).call();
    } catch(_err) {
      throw new Error(`NFT ${this.props.tokenId} not found in collection ${this.props.collection}`)
    }
    const isOwner = nftOwner && nftOwner === this.props.web3.defaultAccount;
    this.localState.imgSrc = tokenURI;

    return {
      dto, nftCollection, troublesomeCollection, nftOwner, isOwner,
      collectionName, collectionSymbol, tokenURI,
    };
  }

  handleImgError = () => {
    this.localState.imgSrc = null;
    this.forceUpdate();
  };

  render() {
    var loadedNft = undefined;
    if (this.externalCache.collectionName) {
      loadedNft = <Card>
        {/* We do this to check whether img path is valid before rendering */}
        {this.localState.imgSrc && <Card.Img onError={() => this.handleImgError()} src={this.localState.imgSrc}/>}
        Name: {this.externalCache.collectionName} Symbol: {this.externalCache.collectionSymbol} tokenURI: {this.externalCache.tokenURI}
        </Card>;
    }

    if (this.localState.error !== undefined) {
      return <div>
          {loadedNft !== undefined ? loadedNft : null}
          <Card bg="danger" text="white" style={{width: '18rem'}}>
            <Card.Body>
              <Card.Title>Error</Card.Title>
              <Card.Text>{this.localState.error}</Card.Text>
              <Button variant="light" onClick={() => this.refreshPage()}></Button>
            </Card.Body>
          </Card>;
        </div>;
    }

    if (this.props.web3 === undefined) {
      return <Spinner animation="border" />;
    }

    if (this.externalCache.troublesomeCollection === ZERO_ADDR) {
      return (<Card>
        {loadedNft}
        <Card.Text>This NFT collection is not in DoubleTrouble yet</Card.Text>
        <Button variant="outline-success" onClick={this.makeTroublesomeCollection}>
          Create a troublesome collection for it
        </Button>
      </Card>);
    }

    if (this.externalCache.troublesomeCollection === undefined) {
      return <Card bg="danger" text="white" style={{width: '18rem'}}>
        <Card.Body>
          <Card.Title>Error</Card.Title>
          <Card.Text>{this.localState.error}</Card.Text>
          <Button variant="light" onClick={() => this.refreshPage()}>Go back</Button>
        </Card.Body>
      </Card>;
    }
    return (<div>
      <div>Name: {this.externalCache.collectionName} Symbol: {this.externalCache.collectionSymbol}</div>
      This NFT already has a troublesome Collection.
      <a href={`/collections/${this.externalCache.troublesomeCollection}/${this.props.tokenId}`}>View it</a>
    </div>);
  }

  makeTroublesomeCollection = async () => {
    try {
      const {dto, collectionName, collectionSymbol} = this.externalCache;
      await dto.methods
        .makeTroublesomeCollection(this.props.collection, collectionName, collectionSymbol)
        .send({from: this.props.web3.defaultAccount});
      this.deriveAndRender();
    } catch(err) {
      console.warn("Error when making Troublesome collection");
      console.warn(err);
    }
  };
};

export default ERC721Inspector;