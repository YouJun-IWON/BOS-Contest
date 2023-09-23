let accountId = context.accountId;
const size = '3em';

const contractId = 'nft.genadrop.near';

if (!contractId) {
  return `Missing prop "contractId"`;
}

if (!accountId) {
  return `Missing prop "accountId"`;
}

const nfts =
  props.nfts ||
  Near.view(contractId, 'nft_tokens_for_owner', {
    account_id: accountId,
    from_index: '0',
    limit: 200,
  });

if (!nfts) {
  return '';
}

const Card = styled.div`
  padding: 1em;
  border: 1px solid #ccc;
  gap: 2em;
  margin: 10px auto;
  border-radius: 0.7em;
`;

const SmallContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
`;

const CenteredDiv = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #828282;

  border-radius: 10px;
  padding: 10px;
  margin: 10px;
  text-align: center;
  & > *:not(:last-child) {
    margin-bottom: 10px;
  }

  transition: background-color 0.3s ease;
  &:hover {
    background-color: #6ce89f; /* Change background color to gray on hover */
  }
`;

const StyledImage = styled.img`
  object-fit: cover;
  max-width: 240px;
  max-height: 240px;
  overflow-wrap: break-word;
  border-radius: 10px; /* Rounded corners, you can adjust the value */
`;

const FlexColumnContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #c5c5c5;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;
// Coin Price
const resCoin = fetch(
  'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cnear%2Cethereum%2Cdogecoin&vs_currencies=usd'
);
const coinPrice = resCoin.body;

return (
  <Card>
    <h4>💰 Coin dNFT</h4>

    <SmallContainer>
      {nfts
        .filter((nft) => {
          const metadata = nft.metadata;
          if (metadata && metadata.description) {
            const words = metadata.description.split(' ');
            return (
              words[0] === 'dnft:' && words[1] === 'CoinPrice:' && words[2]
            );
          }
          return false;
        })
        .map((nft) => {
          const metadata = nft.metadata;

          const description = metadata.description;

          const metadataStart = description.indexOf('{');

          const metadataString = description.slice(metadataStart);

          const showMetadata = JSON.parse(metadataString);

          const words = metadata.description.split(' ');
          const coinPriceIndex = words.indexOf('CoinPrice:');
          const title = metadata.title;

          const coinName =
            coinPriceIndex !== -1 ? words[coinPriceIndex + 1] : '';

          const cid1 = showMetadata.img1.cid;
          const cid2 = showMetadata.img2.cid;
          const cid3 = showMetadata.img3.cid;

          const text1 = showMetadata.text1;
          const text2 = showMetadata.text2;
          const text3 = showMetadata.text3;

          const num1 = showMetadata.num1.replace(/,/g, '');
          const num2 = showMetadata.num2.replace(/,/g, '');
          const num3 = showMetadata.num3.replace(/,/g, '');
          console.log(Number(coinPrice[coinName].usd));
          console.log(Number(num3));

          return (
            <a
              className='text-decoration-none text-black'
              href={`https://www.coingecko.com/en/coins/${coinName}`}
            >
              <CenteredDiv key={nft.token_id}>
                {Number(coinPrice[coinName].usd) >= Number(num3) ? (
                  <FlexColumnContainer>
                    <StyledImage
                      src={`https://ipfs.near.social/ipfs/${cid3}`}
                      alt='uploaded'
                    />
                    <span className='mt-2'>{coinName}</span>
                    <h3>{text3}</h3>
                  </FlexColumnContainer>
                ) : Number(coinPrice[coinName].usd) >= Number(num2) ? (
                  <FlexColumnContainer>
                    <StyledImage
                      src={`https://ipfs.near.social/ipfs/${cid2}`}
                      alt='uploaded'
                    />
                    <span className='mt-2'>{coinName}</span>
                    <h3>{text2}</h3>
                  </FlexColumnContainer>
                ) : Number(coinPrice[coinName].usd) >= Number(num1) ? (
                  <FlexColumnContainer>
                    <StyledImage
                      src={`https://ipfs.near.social/ipfs/${cid1}`}
                      alt='uploaded'
                    />
                    <span className='mt-2'>{coinName}</span>
                    <h3>{text1}</h3>
                  </FlexColumnContainer>
                ) : (
                  <FlexColumnContainer>
                    <Widget
                      src='mob.near/widget/NftImage'
                      props={{
                        nft: {
                          tokenId: nft.token_id,
                          contractId,
                        },
                        style: {
                          width: size,
                          height: size,
                          objectFit: 'cover',
                          minWidth: 270,
                          minHeight: 250,
                          maxWidth: size,
                          maxHeight: size,
                          overflowWrap: 'break-word',
                        },
                        thumbnail: 'thumbnail',
                        className: 'rounded',
                        fallbackUrl:
                          'https://ipfs.near.social/ipfs/bafkreihdiy3ec4epkkx7wc4wevssruen6b7f3oep5ylicnpnyyqzayvcry',
                        alt: `NFT ${contractId} ${nft.token_id}`,
                      }}
                    />
                    <span className='mt-2'>{coinName}</span>
                    <h3>{title}</h3>
                  </FlexColumnContainer>
                )}

                <span>{showMetadata.description}</span>
                <span>{coinPrice[coinName].usd}$</span>
              </CenteredDiv>
            </a>
          );
        })}
    </SmallContainer>
  </Card>
);
