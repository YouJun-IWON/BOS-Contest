let accountId = context.accountId;
const size = "3em";

const contractId = "nft.genadrop.near";

if (!contractId) {
  return `Missing prop "contractId"`;
}

if (!accountId) {
  return `Missing prop "accountId"`;
}

const nfts =
  props.nfts ||
  Near.view(contractId, "nft_tokens_for_owner", {
    account_id: accountId,
    from_index: "0",
    limit: 200,
  });

if (!nfts) {
  return "";
}

// get My near Posts
State.init({
  isInit: false,
  posts: [],
});

const getMyPosts = () => {
  asyncFetch(
    "https://queryapi-hasura-graphql-24ktefolwq-ew.a.run.app/v1/graphql",
    {
      method: "POST",
      headers: { "x-hasura-role": "nearpavel_near" },
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
    <h4>📨 Near Social dNFT</h4>

    <SmallContainer>
      {nfts
        .filter((nft) => {
          const metadata = nft.metadata;
          if (metadata && metadata.description) {
            const words = metadata.description.split(" ");
            return words[0] === "dnft:" && words[1] === "NearSocial:";
          }
          return false;
        })
        .map((nft) => {
          const metadata = nft.metadata;

          const description = metadata.description;

          const title = metadata.title;

          const metadataStart = description.indexOf("{");
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
              className="text-decoration-none text-black"
              href={`https://near.org/near/widget/ProfilePage?accountId=${accountId}&tab=overview`}
            >
              <CenteredDiv key={nft.token_id}>
                {Number(num3) <= state.posts.length ? (
                  <FlexColumnContainer>
                    <StyledImage
                      src={`https://ipfs.near.social/ipfs/${cid3}`}
                      alt="uploaded"
                    />

                    <h3 className="mt-2">{text3}</h3>
                    <span className="mb-2">{num3} ~</span>
                  </FlexColumnContainer>
                ) : Number(num2) <= state.posts.length ? (
                  <FlexColumnContainer>
                    <StyledImage
                      src={`https://ipfs.near.social/ipfs/${cid2}`}
                      alt="uploaded"
                    />

                    <h3 className="mt-2">{text2}</h3>
                    <span>
                      {" "}
                      {num2} ~ {num3}
                    </span>
                  </FlexColumnContainer>
                ) : Number(num1) <= state.posts.length ? (
                  <FlexColumnContainer>
                    <StyledImage
                      src={`https://ipfs.near.social/ipfs/${cid1}`}
                      alt="uploaded"
                    />

                    <h3 className="mt-2">{text1}</h3>
                    <span className="mb-2">
                      {num1} ~ {num2}
                    </span>
                  </FlexColumnContainer>
                ) : (
                  <FlexColumnContainer>
                    <Widget
                      src="mob.near/widget/NftImage"
                      props={{
                        nft: {
                          tokenId: nft.token_id,
                          contractId,
                        },
                        style: {
                          width: size,
                          height: size,
                          objectFit: "cover",
                          minWidth: 270,
                          minHeight: 250,
                          maxWidth: size,
                          maxHeight: size,
                          overflowWrap: "break-word",
                        },
                        thumbnail: "thumbnail",
                        className: "rounded",
                        fallbackUrl:
                          "https://ipfs.near.social/ipfs/bafkreihdiy3ec4epkkx7wc4wevssruen6b7f3oep5ylicnpnyyqzayvcry",
                        alt: `NFT ${contractId} ${nft.token_id}`,
                      }}
                    />

                    <div className="mb-2 mt-2">0 ~ {num1}</div>
                  </FlexColumnContainer>
                )}

                <h3>{title}</h3>
                <span className="mb-2">{showMetadata.description}</span>
              </CenteredDiv>
            </a>
          );
        })}
    </SmallContainer>
  </Card>
);
