let accountId = context.accountId;
const item = {
  type: "social",
  path: `${accountId}/post/main`,
  blockHeight: 101689339,
};
const notifyAccountId = accountId;

// const item = props.item;

if (!item) {
  return "";
}

const likes = Social.index("like", item);

console.log("wef", likes); 
//0: Object
// accountId: "7649ed19fe15dead3bb479bbbf3acd3a2b337eead0999673d20b9935e4d60d8e"
// blockHeight: 101692034
// value: Object
// 1: Object
// accountId: "youjun.near"
// blockHeight: 101708562
// value: Object

const dataLoading = likes === null;

const likesByUsers = {};

(likes || []).forEach((like) => {
  if (like.value.type === "like") {
    likesByUsers[like.accountId] = like;
  } else if (like.value.type === "unlike") {
    delete likesByUsers[like.accountId];
  }
});
if (state.hasLike === true) {
  likesByUsers[context.accountId] = {
    accountId: context.accountId,
  };
} else if (state.hasLike === false) {
  delete likesByUsers[context.accountId];
}

const accountsWithLikes = Object.keys(likesByUsers);
const hasLike = context.accountId && !!likesByUsers[context.accountId];



console.log('person', likesByUsers)
// {7649ed19fe15dead3bb479bbbf3acd3a2b337eead0999673d20b9935e4d60d8e: Object, youjun.near: Object}




const LikeButton = styled.button`
  border: 0 !important;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 2.5em;
  height: 2.5em;
  &:hover {
    color: red;
    background: pink;
  }
  .bi-heart-fill {
    color: red;
  }
`;

const likeClick = () => {
  if (state.loading) {
    return;
  }
  State.update({
    loading: true,
  });
  const data = {
    index: {
      like: JSON.stringify({
        key: item,
        value: {
          type: hasLike ? "unlike" : "like",
        },
      }),
    },
  };

  if (!hasLike && props.notifyAccountId) {
    data.index.notify = JSON.stringify({
      key: props.notifyAccountId,
      value: {
        type: "like",
        item,
      },
    });
  }
  Social.set(data, {
    onCommit: () => State.update({ loading: false, hasLike: !hasLike }),
    onCancel: () => State.update({ loading: false }),
  });
};

const title = hasLike ? "Unlike" : "Like";

return (
  <div className="d-inline-flex align-items-center">
    <LikeButton
      disabled={state.loading || dataLoading || !context.accountId}
      className="btn me-1"
      title={title}
      onClick={likeClick}
    >
      {state.loading || dataLoading ? (
        <span
          className="spinner-grow spinner-grow-sm p-2"
          role="status"
          aria-hidden="true"
        />
      ) : (
        <i
          className={`bi fs-4 pt-1 ${hasLike ? "bi-heart-fill" : "bi-heart"}`}
        />
      )}
    </LikeButton>
    <Widget src="mob.near/widget/LikeButton.Faces" props={{ likesByUsers }} />
  </div>
);


