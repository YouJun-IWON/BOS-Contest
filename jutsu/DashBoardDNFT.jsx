let accountId = context.accountId;
const profile = socialGetr(`${accountId}/profile`);

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

// get My near Posts
State.init({
  isInit: false,
  posts: [],
});

const getMyPosts = () => {
  asyncFetch(
    'https://queryapi-hasura-graphql-24ktefolwq-ew.a.run.app/v1/graphql',
    {
      method: 'POST',
      headers: { 'x-hasura-role': 'nearpavel_near' },
      body: JSON.stringify({
        query: `query MyPosts {
          nearpavel_near_social_posts_posts(where: {account_id: {_eq: "${accountId}"}}, order_by: {block_timestamp: desc}) {
          account_id
          block_height
          block_timestamp
          content
          receipt_id
        }
      }`,
      }),
    }
  ).then((postRes) => {
    if (postRes.body.errors === undefined) {
      State.update({
        isInit: true,
        posts: postRes.body.data.nearpavel_near_social_posts_posts,
      });
    }
  });
};

if (state.isInit === false) {
  getMyPosts();
}

// get my near posts likes

let heartCount = 0;
const likesByUsers = {};

const Post = state.posts.map((post) => {
  const block_height = post.block_height;

  const item = {
    type: 'social',
    path: `${accountId}/post/main`,
    blockHeight: block_height,
  };

  const likes = Social.index('like', item);

  (likes || []).forEach((like) => {
    if (like.value.type === 'like') {
      heartCount += 1;
      likesByUsers[like.accountId] = like;
    } else if (like.value.type === 'unlike') {
      heartCount -= 1;
      delete likesByUsers[like.accountId];
    }
  });
});

// get My near Social

const data = Social.getr(`${accountId}/widget/*`, 'final', {
  subscribe: true,
});

const widgetEntries =
  data === undefined || data === null ? [] : Object.entries(data);

// Coin Price
const resCoin = fetch(
  'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Clitecoin%2Cethereum%2Cdogecoin&vs_currencies=usd'
);
const coinPrice = resCoin.body;

const Container = styled.div`
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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

const FlexContainer = styled.div`
  display: grid;
  grid-template-columns: 300px 3fr;
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
  <Container>
    <div className='container'>
      <div className='content'>
        <FlexContainer>
          <ParentDiv>
            <Widget src='7649ed19fe15dead3bb479bbbf3acd3a2b337eead0999673d20b9935e4d60d8e/widget/Profile' />
            <div className='mt-2'>Near Social Posts: {state.posts.length}</div>
            <div className='mt-2'>BOS Components: {widgetEntries.length}</div>

            <ChildDiv>
              <SpanDiv>My dNFT</SpanDiv>
              <DnftDiv>
                <div className='d-flex gap-1 flex-wrap'>
                  {nfts
                    .filter((nft) => {
                      const metadata = nft.metadata;
                      if (metadata && metadata.description) {
                        // Split the description into words and check if the first word is 'dnft'
                        const words = metadata.description.split(' ');
                        return words[0] === 'dnft:';
                      }
                      return false; // Exclude NFTs without metadata or description
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
              props={{ topText: 'My Dashboard as', bottomText: 'dNFT' }}
            />

            <Main className='container-fluid'>
              <div>
                {/* Weather DNFT Component */}
                <Widget
                  src='7649ed19fe15dead3bb479bbbf3acd3a2b337eead0999673d20b9935e4d60d8e/widget/WeatherDNFT'
                  props={{ nfts: nfts }}
                />
                {/* Coin DNFT Component */}
                <Widget
                  src='7649ed19fe15dead3bb479bbbf3acd3a2b337eead0999673d20b9935e4d60d8e/widget/CoinDNFT'
                  props={{ nfts: nfts }}
                />
                {/* Social DNFT Component */}
                <Widget
                  src='7649ed19fe15dead3bb479bbbf3acd3a2b337eead0999673d20b9935e4d60d8e/widget/NearSocialDNFT'
                  props={{ nfts: nfts }}
                />
                {/* Social Heart DNFT Component */}
                <Widget
                  src='7649ed19fe15dead3bb479bbbf3acd3a2b337eead0999673d20b9935e4d60d8e/widget/NearSocialHeartDNFT'
                  props={{ nfts: nfts }}
                />
                {/* BOS Component DNFT Component */}
                <Widget
                  src='7649ed19fe15dead3bb479bbbf3acd3a2b337eead0999673d20b9935e4d60d8e/widget/NearComponentDNFT'
                  props={{ nfts: nfts }}
                />
              </div>
            </Main>
          </div>
        </FlexContainer>
      </div>
    </div>
  </Container>
);
