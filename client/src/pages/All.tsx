import React, {useContext} from 'react'
import { Container, ContentBlock,  ContentRow, MainContent, Section } from '../components/base/base'
import { utils } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import { TextBold, } from '../typography/Text'
import { Colors, } from '../global/styles'
import styled from 'styled-components'
import { useEthers } from '@usedapp/core'
import { truncAddr, OpenSeaLink, _useContractCall, _useContractCalls, effectiveNFTPrice } from '../helpers';
import ClaimableTokens from '../abi/ClaimableTokens.json'
import { CryptoTokensContext } from '../CryptoTokens';
import GenericNFTContract from '../abi/IERC721Metadata.json'
import { GitHubLink, EtherscanContractLink, } from '../helpers'
import { Link } from '../components/base/Link'


export function AllPage() {
  //const { active } = useEthers();
  const { eventTokensAddr } = useContext(CryptoTokensContext);
  return (
    <MainContent>
      <Container>
        <Section>
          <ContentBlock>
            <ContentRow>
              <div>
                <h1 style={{marginBottom: 20}}>
                  Crypto Tokens 🖤 by Brex
                </h1>
                <div style={{marginBottom: 20}}>We are minting NFTs for attendees of real life events we host. See the ones we've minted so far on <a href={`https://opensea.io/collection/xerb-tokens`}>OpenSea</a>.</div>

                <div style={{marginBottom: 35}}>So great to see you back IRL.</div>

                <EtherscanContractLink style={{position: 'absolute', bottom: 40, right: 20}} contract={eventTokensAddr} />
                <GitHubLink style={{ position: 'absolute', bottom: 20, right: 20}} />
              </div>
            </ContentRow>
          </ContentBlock>
        </Section>
      </Container>
    </MainContent>
  )
}

export function All() {
  const { account, library } = useEthers();
  const { eventTokensAddr } = useContext(CryptoTokensContext);

  const etContract = new Contract(eventTokensAddr, new utils.Interface(ClaimableTokens.abi), library);
  const useEtCall = (method: string, args: any[]) => {
    return _useContractCall({
      abi: etContract.interface,
      address: eventTokensAddr,
      method: method,
      args: args,
    });
  };

  const allNfts = useEtCall('registeredTokens', []);
  const nameForNfts = _useContractCalls((allNfts).map((t: any) => {
    return {
      abi: new utils.Interface(GenericNFTContract.abi),
      address: t.collection,
      method: 'name',
      args: [],
    }
  }))
  const ownerForNfts = _useContractCalls((allNfts).map((t: any) => {
    return {
      abi: new utils.Interface(GenericNFTContract.abi),
      address: t.collection,
      method: 'ownerOf',
      args: [t.tokenId],
    }
  }))

  return (
          <TokensContentBlock>
            <List>
              {allNfts &&
                allNfts.map((t: any, i: number) => (
                  <TokenItem key={`${t.collection}${t.tokenId.toString()}`}>
                    <TokenName>
                      <Link href={`/collections/${t.collection}/${t.tokenId}`}>
                        {nameForNfts[i] ?? t.collection} {t.tokenId.toString()}
                      </Link>
                    </TokenName>
                    <TokenPrice>
                    Selling for {utils.formatEther(effectiveNFTPrice(t.forSalePrice, t.lastPurchasePrice))} ETH
                    </TokenPrice>
                    <TokenTicker>
                    Owner: {truncAddr(ownerForNfts[i] ?? '', 8)} {ownerForNfts[i] === account && '(you)'}
                    </TokenTicker>
                    <OpenSeaLink collection={t.collection} tokenId={t.tokenId}
                      style={{gridArea: 'view', marginTop: 0}} />
                  </TokenItem>
                ))}
            </List>
          </TokensContentBlock>
  )
}

const TokensContentBlock = styled(ContentBlock)`
  padding: 16px 32px;
`

const List = styled.ul`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const TokenItem = styled.li`
  display: grid;
  grid-template-areas:
    'name price view'
    'ticker price view';
  grid-template-columns: 1fr 2fr auto;
  grid-template-rows: auto auto;
  grid-column-gap: 20px;
  grid-row-gap: 8px;
  align-items: center;
  padding: 12px 0;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;

  & + & {
    border-top: 1px solid ${Colors.Black[200]};
  }
`


const TokenName = styled(TextBold)`
  grid-area: name;
`

const TokenTicker = styled(TextBold)`
  grid-area: ticker;
  color: ${Colors.Gray[600]};
`

const TokenPrice = styled(TextBold)`
  grid-area: price;
  font-size: 18px;
  line-height: 32px;
`
