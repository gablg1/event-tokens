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

export function CreateEvent() {
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
              <InnerCreateEvent />
            }
            </ContentRow>
          </ContentBlock>
        </Section>
      </Container>
    </MainContent>
  );
}


function InnerCreateEvent() {
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
  const registeredTokens = useEtCall('registeredTokens', []);
  console.log(registeredTokens);
  const owner = useEtCall('owner', []);

  if (owner && owner !== account) {
    console.log(owner);
    return <div>You are not the owner.</div>
  }

  return (
    <>
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


