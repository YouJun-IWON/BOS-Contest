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

return (
  <Card>
    <h4>🌈 Weather dNFT</h4>

    <SmallContainer>
      {nfts
        .filter((nft) => {
          const metadata = nft.metadata;
          if (metadata && metadata.description) {
            const words = metadata.description.split(' ');
            return (
              words[0] === 'dnft:' &&
              words[1] === 'Weather:' &&
              words[2] &&
              words[2] !== 'New' // New York error => fix => stopgap!
            );
          }
          return false;
        })
        .map((nft) => {
          const metadata = nft.metadata;

          const description = metadata.description;
          const words = metadata.description.split(' ');
          const weatherIndex = words.indexOf('Weather:');
          const title = metadata.title;

          const locationName =
            weatherIndex !== -1
              ? words[weatherIndex + 1].replace(/([a-z])([A-Z])/g, '$1 $2')
              : '';

          const resWeather = fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${locationName}&appid=0d898a9e30a80a233ce8882b12be2031`
          );
          const weatherInfo = resWeather.body;
          const locationId = weatherInfo.id;

          const weatherState = weatherInfo.weather[0].main;
          const weatherDesc = weatherInfo.main;

          const metadataStart = description.indexOf('{');
          const metadataString = description.slice(metadataStart);

          const showMetadata = JSON.parse(metadataString);

          const cid1 = showMetadata.img1.cid;
          const cid2 = showMetadata.img2.cid;
          const cid3 = showMetadata.img3.cid;

          const text1 = showMetadata.text1;
          const text2 = showMetadata.text2;
          const text3 = showMetadata.text3;

          const num1 = showMetadata.num1;
          const num2 = showMetadata.num2;
          const num3 = showMetadata.num3;

          return (
            <a
              className='text-decoration-none text-black'
              href={`https://openweathermap.org/city/${locationId}`}
            >
              <CenteredDiv key={nft.token_id}>
                {weatherState === 'Clear' ? (
                  <FlexColumnContainer>
                    <StyledImage
                      src={`https://ipfs.near.social/ipfs/${cid1}`}
                      alt='uploaded'
                    />
                    <div className='mt-2'>{locationName}</div>
                    <h3>{text1}</h3>
                    <div className='mb-2'>{showMetadata.description}</div>
                  </FlexColumnContainer>
                ) : weatherState === 'Rain' ? (
                  <FlexColumnContainer>
                    <StyledImage
                      src={`https://ipfs.near.social/ipfs/${cid2}`}
                      alt='uploaded'
                    />
                    <div className='mt-2'>{locationName}</div>
                    <h3>{text2}</h3>
                    <div>{showMetadata.description}</div>
                  </FlexColumnContainer>
                ) : weatherState === 'Clouds' ? (
                  <FlexColumnContainer>
                    <StyledImage
                      src={`https://ipfs.near.social/ipfs/${cid3}`}
                      alt='uploaded'
                    />
                    <div className='mt-2'>{locationName}</div>
                    <h3>{text3}</h3>
                    <div className='mb-2'>{showMetadata.description}</div>
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
                    <div className='mt-2'>{locationName}</div>
                    <h3>{title}</h3>
                    <div className='mb-2'>{showMetadata.description}</div>
                  </FlexColumnContainer>
                )}

                <h3>
                  {weatherState === 'Clear'
                    ? '☀️'
                    : weatherState === 'Rain'
                    ? '🌧️'
                    : weatherState === 'Clouds'
                    ? '☁️'
                    : ''}
                </h3>

                <span>{(weatherDesc.temp - 273.15).toFixed(2)}° C</span>
                <span>Humidity : {weatherDesc.humidity}%</span>
                <span>Pressure : {weatherDesc.pressure}hPa</span>
              </CenteredDiv>
            </a>
          );
        })}
    </SmallContainer>
  </Card>
);
