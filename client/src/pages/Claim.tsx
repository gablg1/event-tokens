import React, { useState } from 'react'
import { Container, ContentBlock, ContentRow, MainContent, Section, SectionRow } from '../components/base/base'
import { AccountButton } from '../components/account/AccountButton'
import { Title } from '../typography/Title'
import { InputGroup, FormControl } from 'react-bootstrap';
import { LoginButton } from "../components/account/AccountButton";
import { BsQuestionCircle } from "react-icons/bs";
import { Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';

export function Claim() {
  // const { active } = useEthers();
  const [eventCode, setEventCode] = useState('');
  const [tokenId, setTokenId] = useState(0);

  return (
    <MainContent>
      <Container>
        <Section>
          <SectionRow>
            <Title>Claim your NFT</Title>
            <AccountButton />
          </SectionRow>
          <ContentBlock>
            <ContentRow>
              <InputGroup className="mb-3">
                <InputGroup.Text>
                  Event Code 
                  <Tooltip title="The Code Associated With Your Event">
                    <IconButton>
                      <BsQuestionCircle />
                    </IconButton>
                  </Tooltip>
                </InputGroup.Text>
                <FormControl id="find-nft" aria-describedby="basic-addon3"
                  onChange={(e) => setEventCode(e.target.value)}  value={eventCode || ''} />
              </InputGroup>

              <InputGroup className="mb-3">
                <InputGroup.Text>
                  Token ID
                  <Tooltip title="The Unique ID For Your NFT">
                    <IconButton>
                      <BsQuestionCircle />
                    </IconButton>
                  </Tooltip>
                </InputGroup.Text>
                <FormControl type="number" id="find-nft" aria-describedby="basic-addon3"
                  onChange={(e) => setTokenId(e.target.value ? parseInt(e.target.value) : 0)}  value={tokenId} />
              </InputGroup>
              <LoginButton>Claim</LoginButton>

              {/* {active && eventCode ?
                (utils.isAddress(eventCode)
                  ? <NFTViewer collection={eventCode} tokenId={tokenId} />
                  : <Text>Address {eventCode} is invalid</Text>
                )
              : ''} */}
            </ContentRow>
          </ContentBlock>
        </Section>
      </Container>
    </MainContent>
  )
}

