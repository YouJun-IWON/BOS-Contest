const user = "gagdiez.near";
// user에 따라 자신이 near에서 소유하고 있는 nft가 무엇인지 알게 하자
const props = { name: "Anna" };

return (
  <>
    <div class="container min-vw-100">

      <h3> Composing Widgets </h3>
      <p> Widgets can be composed </p>
      <hr />

      <Widget src={`${user}/widget/Greetings`} props={props} />
    </div>
  </>
);


// ! IPFS uploader
State.init({
  img: null,
});

return (
  <div className='container row'>
    <div>
      Image upload: <br />
      <IpfsImageUpload image={state.img} />
    </div>
    <div>
      Raw State:
      <pre>{JSON.stringify(state)}</pre>
    </div>
    <div className='mt-2'>
      {state.img.cid && (
        <img
          src={`https://ipfs.near.social/ipfs/${state.img.cid}`}
          alt='uploaded'
        />
      )}
    </div>
  </div>
);

// url : https://ipfs.near.social/ipfs/bafkreieehsmttjhcbpv77xh5c25w2noiuhe5lmwm4lb4txj6faipgras34
// 그러나 img tag 안에서만 이미지를 확인할 수 있다. near blockchain에만 기록되서 그런 것 같다. 



State.init({ img: null });

const uploadFileUpdateState = (body) => {
  asyncFetch(
    "https://ipfs.near.social/add",
    {
      method: "POST",
      headers: { Accept: "application/json" },
      body
    }
  ).then(
    (res) => {
      const cid = res.body.cid;
      State.update({ img: { cid } });
    }
  )
};

const filesOnChange = (files) => {
  if (files) {
    State.update({ img: { uploading: true, cid: null } });
    uploadFileUpdateState(files[0]);
  }
};

return (
  <div className="d-inline-block">
    { state.img?
      <img class="rounded w-100 h-100"
        style={{ objectFit: "cover" }}
        src={`https://ipfs.near.social/ipfs/${state.img.cid}`}
        alt="upload preview" />
      : ""
    }
    <Files
      multiple={false}
      accepts={["image/*"]}
      minFileSize={1}
      clickable
      className="btn btn-outline-primary"
      onChange={filesOnChange}
    >
      { state.img?.uploading ? <> Uploading </> : "Upload an Image" }
    </Files>
  </div>
);
