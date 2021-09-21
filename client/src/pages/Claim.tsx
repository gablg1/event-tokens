import React, { useState, useContext } from 'react'
import { useContractFunction, useEthers } from '@usedapp/core'
import { Container, ContentBlock, ContentRow, MainContent, Section, SectionRow } from '../components/base/base'
import { AccountButton } from '../components/account/AccountButton'
import { Title } from '../typography/Title'
import { Table, InputGroup, FormControl } from 'react-bootstrap';
import { LoginButton } from "../components/account/AccountButton";
import { BsQuestionCircle } from "react-icons/bs";
import { Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { CryptoTokensContext } from '../CryptoTokens';
import { Contract } from '@ethersproject/contracts'
import ClaimableTokens from '../abi/ClaimableTokens.json'
import { utils } from 'ethers'
import { BigNumber } from '@ethersproject/bignumber'
import { _useContractCall, OpenSeaLink } from '../helpers';

export function ClaimPage(props: {eventId: number, fraction: number}) {
  const { active, account } = useEthers();
  return (
    <MainContent>
      <Container>
        <Section>
          <SectionRow>
            <Title> </Title>
            <AccountButton />
          </SectionRow>
          <ContentBlock>
            <ContentRow>
            {active && account &&
              <Claim eventId={props.eventId} fraction={props.fraction} />
            }
            </ContentRow>
          </ContentBlock>
        </Section>
      </Container>
    </MainContent>
  );
}


export function Claim(props: {eventId: number, fraction: number}) {
  const { chainId, active, account, library, } = useEthers();
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

  // Local state
  const [accessCode, setAccessCode] = useState('');

  // Read from contract
  const totalSupply = useEtCall('totalSupply', [props.eventId]);
  const claimedBy = useEtCall('claimedBy', [props.eventId, props.fraction]);
  const balance = useEtCall('balanceOf', [account, props.eventId]);
  const tokenUri = useEtCall('uri', [props.eventId]);

  if (totalSupply && BigNumber.from(0).eq(totalSupply)) {
    return <div>Event Id {props.eventId} not found.</div>
  }

  return (
    <>
      <Table striped bordered hover>
        <tbody>
          <tr>
            <td>Event ID</td>
            <td>{props.eventId}</td>
          </tr>
          <tr>
            <td>Fraction #</td>
            <td>{props.fraction}</td>
          </tr>
          <tr>
            <td>Metadata URI</td>
            <td>{tokenUri}</td>
          </tr>
        </tbody>
      </Table>
      <InputGroup className="mb-3">
        <InputGroup.Text>
          Access Code
          <Tooltip title="The QR code given to you at the event">
            <IconButton>
              <BsQuestionCircle />
            </IconButton>
          </Tooltip>
        </InputGroup.Text>
        <FormControl id="find-nft" aria-describedby="basic-addon3"
          onChange={(e) => setAccessCode(e.target.value)}  value={accessCode || ''} />
      </InputGroup>

      <LoginButton>Claim</LoginButton>
          {/* {active && eventCode ?
            (utils.isAddress(eventCode)
              ? <NFTViewer collection={eventCode} tokenId={tokenId} />
              : <Text>Address {eventCode} is invalid</Text>
            )
          : ''} */}
    </>

  )
}


