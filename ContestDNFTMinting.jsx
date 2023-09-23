let accountId = context.accountId;
const profile = socialGetr(`${accountId}/profile`);

let cid = props.cid ?? '';
let image = props.image;
const mintButton = props.mintButton ?? 'Mint';

const title = props.title ?? 'Example title';
const receiver = props.receiver ?? 'Example.near or Address';

if (image) {
  cid = image.cid;
  console.log('Image CID: ' + cid);
}

let description = props.description ?? 'Proof of Vibes powered by dNFT';

if (profile === null) {
  IpfsImageUpload();
  return 'Loading';
}

// check My dNFT

const contractId = 'nft.genadrop.near';

if (!contractId) {
  return `Missing prop "contractId"`;
}

if (!accountId) {
  return `Missing prop "accountId"`;
}

const nfts = Near.view(contractId, 'nft_tokens_for_owner', {
  account_id: accountId,
  from_index: '0',
  limit: 200,
});

if (!nfts) {
  return '';
}

const size = '3em';

State.init({
  cid: cid,
  description: description,
  title: title,
  image: image,
  receiver: receiver,
  //   image: "",

  img1: null,
  text1: null,
  num1: null,

  img2: null,
  text2: null,
  num2: null,

  img3: null,
  text3: null,
  num3: null,
});

const handleMint = () => {
  if (!state.image.cid) {
    return;
  }
  if (!accountId) {
    console.log('Please login');
    State.update({
      showAlert: true,
      toastMessage: 'Please log in before continuing',
    });
    setTimeout(() => {
      State.update({
        showAlert: false,
      });
    }, 3000);
  } else if (!state.title) {
    console.log('Please Enter title');
    State.update({
      showAlert: true,
      toastMessage: 'Please enter a title for the NFT',
    });

    setTimeout(() => {
      State.update({
        showAlert: false,
      });
    }, 3000);
  } else if (!state.description) {
    State.update({
      showAlert: true,
      toastMessage: 'Please enter a description for the NFT',
    });
    setTimeout(() => {
      State.update({
        showAlert: false,
      });
    }, 3000);
  } else {
    const attrdesc = {
      description: state.description,
      img1: state.img1,
      text1: state.text1,
      num1: state.num1,

      img2: state.img2,
      text2: state.text2,
      num2: state.num2,

      img3: state.img3,
      text3: state.text3,
      num3: state.num3,
    };

    const desc = JSON.stringify(attrdesc);
    const metadata = {
      name: state.title,
      description: `dnft: ${selectedType}: ${
        selectedLocation || selectedCoin
      } ${desc}`,
      properties: [],
      image: `ipfs://${state.image.cid}`,
    };

    asyncFetch('https://ipfs.near.social/add', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: metadata,
    }).then((res) => {
      const cid = res.body.cid;
      const gas = 200000000000000;
      const deposit = 11450000000000000000000;

      Near.call([
        {
          contractName: 'nft.genadrop.near',
          methodName: 'nft_mint',
          args: {
            token_id: `${Date.now()}`,
            metadata: {
              title: state.title,
              description: `dnft: ${selectedType}: ${
                selectedLocation || selectedCoin
              } ${desc}`,
              properties: [],
              media: `https://ipfs.io/ipfs/${state.image.cid}`,
              reference: `ipfs://${cid}`,
            },
            receiver_id: state.receiver,
          },
          gas: gas,
          deposit: deposit,
        },
      ]);
    });
  }
};

initState({
  title: '',
  description: '',
  showAlert: false,
  toastMessage: '',
});

const onChangeTitle = (title) => {
  State.update({
    title,
  });
};
const onChangeReceiver = (receiver) => {
  State.update({
    receiver,
  });
};

const [selectedType, setSelectedType] = useState('none');
const [selectedLocation, setSelectedLocation] = useState('none');
const [selectedCoin, setSelectedCoin] = useState('none');

const onChangeType = (value) => {
  if (selectedLocation) {
    setSelectedLocation('');
  }
  if (selectedCoin) {
    setSelectedCoin('');
  }
  setSelectedType(value);
};
const onChangeLocation = (value) => {
  if (selectedCoin) {
    setSelectedCoin('');
  }
  setSelectedLocation(value);
};
const onChangeCoin = (value) => {
  if (selectedLocation) {
    setSelectedLocation('');
  }
  setSelectedCoin(value);
};

const onChangeDesc = (description) => {
  State.update({
    description,
  });
};

if (!accountId) {
  console.log('Please login');
  State.update({
    showAlert: true,
    toastMessage: 'Please log in before continuing',
  });
}

const Container = styled.div`
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SmallContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CenteredDiv = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #828282;
  border-radius: 10px;
  padding: 25px;
  margin: 10px;
  text-align: center;
  & > *:not(:last-child) {
    margin-bottom: 10px;
  }
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #f0f0f0; /* Change background color to gray on hover */
  }
`;

const FlexContainer = styled.div`
  display: grid;
  grid-template-columns: 300px 4fr;
  grid-gap: 30px;
`;

const ImageUploadCard = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  width: 80%;
  border: 2px dashed #0d99ff;
  border-radius: 1rem;
  box-shadow: 4px 4px 20px 6px rgba(0, 0, 0, 0.2);
  margin: 30px auto;
  padding: 1.5rem;
  text-align: center;
`;
const Main = styled.div`
  position: relative;
  font-family: 'SF Pro Display', sans-serif;
`;

const Heading = styled.p`
  margin: 10px auto 10px auto;
  font-size: 1em;
  color: #0f1d40;
  width: 60%;
  text-align: center;
  font-family: 'SF Pro Display', sans-serif;
`;

const Toast = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  align-conten: center;
  bottom: 60px;
  right: 20px;
  background-color: red;
  color: #fff;
  padding: 16px;
  border-radius: 8px;

  z-index: 100;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  line-height: 1;
`;

const Elipse = styled.div`
  background-color: #eff3f9;
  height: 100px;
  width: 100px;

  border-radius: 50%;
`;

const Text = styled.p`
  font-size: 0.9rem;
  color: #525c76;
  line-height: 1rem;
  margin: 3px;
`;

const Card = styled.div`
  padding: 1em;
  border: 1px solid #ccc;
  gap: 2em;
  margin: 10px auto;
  border-radius: 0.7em;
`;

const ImageCard = styled.div`
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  height: fit-content;
  max-height: 500px;
  width: 90%;
  max-width: 500px;
  border-radius: 1rem;
  & > img {
    object-fit: contain;
  }
`;

const Input = styled.input`
  display: block;
  padding: 0.5em;
  width: 100%;
  border: 1px solid #e5e8eb;
  border-radius: 10px;
  outline: none;
  background: #f4f5f6;
  color: #525c76;
  :focus {
    border: 1px solid #0d99ff;
  }
  ::placeholder {
    color: palevioletred;
  }
`;

const TextArea = styled.textarea`
  display: block;
  padding: 0.5em;
  width: 100%;
  border: 1px solid #e5e8eb;
  border-radius: 10px;
  outline: none;
  background: #f4f5f6;
  color: #525c76;
  :focus {
    border: 1px solid #0d99ff;
  }
`;

const ParentDiv = styled.div`
  border-radius: 10px;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ccc;
`;

const ChildDiv = styled.div`
  margin-top: 20px;

  border-top: 3px solid #ccc;
`;

const SpanDiv = styled.div`
  margin-top: 5px;
  font-size: 1.25rem;
`;

const DnftDiv = styled.div`
  margin-top: 10px;
`;

const text1Change = (e) => {
  if (e) {
    State.update({ text1: e.target.value });
  }
};
const num1Change = (e) => {
  if (e) {
    State.update({ num1: e.target.value });
  }
};
const text2Change = (e) => {
  if (e) {
    State.update({ text2: e.target.value });
  }
};
const num2Change = (e) => {
  if (e) {
    State.update({ num2: e.target.value });
  }
};
const text3Change = (e) => {
  if (e) {
    State.update({ text3: e.target.value });
  }
};
const num3Change = (e) => {
  if (e) {
    State.update({ num3: e.target.value });
  }
};

return (
  <Container>
    <div className='container'>
      <div className='content'>
        <FlexContainer>
          <ParentDiv>
            <Widget src='7649ed19fe15dead3bb479bbbf3acd3a2b337eead0999673d20b9935e4d60d8e/widget/Profile' />

            <ChildDiv>
              <SpanDiv>My dNFT</SpanDiv>
              <DnftDiv>
                <div className='d-flex gap-1 flex-wrap'>
                  {nfts
                    .filter((nft) => {
                      const metadata = nft.metadata;
                      if (metadata && metadata.description) {
                        const words = metadata.description.split(' ');
                        return words[0] === 'dnft:';
                      }
                      return false;
                    })
                    .map((nft) => (
                      <a
                        className='text-decoration-none'
                        href={`https://app.mynearwallet.com/nft-detail/nft.genadrop.near/${nft.token_id}`}
                      >
                        <Widget
                          src='mob.near/widget/NftImage'
                          props={{
                            nft: { tokenId: nft.token_id, contractId },
                            style: {
                              width: size,
                              height: size,
                              objectFit: 'cover',
                              minWidth: 90,
                              minHeight: 90,
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
                      </a>
                    ))}
                </div>
              </DnftDiv>
            </ChildDiv>
          </ParentDiv>

          <div>
            <Widget
              src='7649ed19fe15dead3bb479bbbf3acd3a2b337eead0999673d20b9935e4d60d8e/widget/Headers'
              props={{ topText: 'Mint!', bottomText: 'dNFT' }}
            />

            <Main className='container-fluid'>
              <div>
                <Card className='d-flex flex-column align-items-center'>
                  {!!state.image.cid ?? (
                    <ImageCard>
                      <img
                        src={`https://ipfs.io/ipfs/` + state.image.cid}
                        alt='uploaded image'
                        width='100%'
                        height='100%'
                        className='rounded-3'
                      />
                    </ImageCard>
                  )}
                  <div>
                    🖼️ Main Image :
                    <IpfsImageUpload
                      image={state.image}
                      className='btn btn-outline-primary border-0 rounded-3'
                    />
                  </div>
                </Card>

                <Card>
                  <h5>dNFT Details</h5>
                  <Card>
                    Title:
                    <Input
                      type='text'
                      onChange={(e) => onChangeTitle(e.target.value)}
                      placeholder={state.title}
                    />
                  </Card>
                  <Card>
                    Description:
                    <TextArea
                      type='text'
                      onChange={(e) => onChangeDesc(e.target.value)}
                      placeholder={state.description}
                    />
                  </Card>
                  <Card>
                    Receiver:
                    <Input
                      type='text'
                      onChange={(e) => onChangeReceiver(e.target.value)}
                      placeholder={state.receiver}
                    />
                  </Card>
                  <Card>
                    dNFT Type:
                    <select
                      value={selectedType}
                      onChange={(e) => onChangeType(e.target.value)}
                    >
                      <option value='none'>Select a Type</option>
                      <option value='Weather'>Weather</option>
                      <option value='NearSocial'>Near Social</option>
                      <option value='NearSocialHeart'>Social Heart</option>
                      <option value='NearComponent'>Near Component</option>
                      <option value='CoinPrice'>Coin Price</option>
                    </select>
                    {selectedType === 'Weather' ? (
                      <select
                        value={selectedLocation}
                        onChange={(e) => onChangeLocation(e.target.value)}
                      >
                        <option value=''>Select a Location</option>
                        <option value='Seoul'>Seoul</option>
                        <option value='London'>London</option>
                        <option value='NewYork'>New York</option>
                        <option value='Beijing'>Beijing</option>
                      </select>
                    ) : selectedType === 'CoinPrice' ? (
                      <select
                        value={selectedCoin}
                        onChange={(e) => onChangeCoin(e.target.value)}
                      >
                        <option value=''>Select a Coin</option>
                        <option value='bitcoin'>Bitcoin</option>
                        <option value='ethereum'>Ethereum</option>
                        <option value='litecoin'>Litecoin</option>
                        <option value='dogecoin'>Dogecoin</option>
                      </select>
                    ) : (
                      ''
                    )}
                    <div>
                      {selectedType === 'CoinPrice'
                        ? '✅ NFT changes based on the coin price. Text: Title. Number: Minimum USD'
                        : selectedType === 'NearSocial'
                        ? '✅ NFT change based on the number of posts you publish on near social. Text: Title. Number: Minimum number of posts'
                        : selectedType === 'Weather'
                        ? '✅ NFT change based on the weather. #1: ☀️ #2: 🌧️ #3: ☁️'
                        : selectedType === 'NearComponent'
                        ? '✅ NFT change based on the number of component you publish on BOS. Text: Title. Number: Minimum number of Component'
                        : selectedType === 'NearSocialHeart'
                        ? '✅ NFT change based on the number of ❤️ you receive on near social. Text: Title. Number: Minimum number of ❤️.'
                        : ''}
                    </div>
                  </Card>

                  <SmallContainer>
                    <CenteredDiv>
                      <span># 1</span>
                      <IpfsImageUpload image={state.img1} />
                      <input onChange={text1Change} placeholder='Text' />
                      <input onChange={num1Change} placeholder='Number' />
                    </CenteredDiv>

                    <CenteredDiv>
                      <span># 2</span>
                      <IpfsImageUpload image={state.img2} />
                      <input onChange={text2Change} placeholder='Text' />
                      <input onChange={num2Change} placeholder='Number' />
                    </CenteredDiv>

                    <CenteredDiv>
                      <span># 3</span>
                      <IpfsImageUpload image={state.img3} />
                      <input onChange={text3Change} placeholder='Text' />
                      <input onChange={num3Change} placeholder='Number' />
                    </CenteredDiv>
                  </SmallContainer>
                </Card>

                <div className='d-flex justify-content-center mb-2'>
                  <button
                    type='button'
                    className='btn btn-primary'
                    onClick={handleMint}
                  >
                    {mintButton}
                  </button>
                </div>
              </div>

              {state.showAlert && (
                <Widget src='jgodwill.near/widget/genalert' props={state} />
              )}
            </Main>
          </div>
        </FlexContainer>
      </div>
    </div>
  </Container>
);
