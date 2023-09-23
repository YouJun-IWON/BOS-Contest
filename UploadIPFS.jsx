const [img1, setImg1] = useState(null);
const [attr1, setattr1] = useState(null);

const [ipfs, setIpfs] = useState(null);

const img1uploadUpdateState = (body) => {
  asyncFetch("https://ipfs.near.social/add", {
    method: "POST",
    headers: { Accept: "application/json" },
    body,
  }).then((res) => {
    const cid = res.body.cid;
    setImg1({ img: { cid } });
  });
};

const img1OnChange = (files) => {
  if (files) {
    setImg1({ img: { uploading: true, cid: null } });
    img1uploadUpdateState(files[0]);
  }
};

const attr1OnChange = (e) => {
  if (e) {
    setattr1({ content: e.target.value });
  }
};

const minting = () => {
  setIpfs({ img1, attr1 }, { img1, attr1 }, { img1, attr1 });
};

return (
  <div className="d-inline-block">
    {img1 ? (
      <div>
        <img
          class="rounded w-25 h-25"
          style={{ objectFit: "cover" }}
          src={`https://ipfs.near.social/ipfs/${img1.img.cid}`}
          alt="upload preview"
        />
        {a}
      </div>
    ) : (
      ""
    )}

    <div>
      <Files
        multiple={false}
        accepts={["image/*"]}
        minFileSize={1}
        clickable
        className="btn btn-outline-primary"
        onChange={img1OnChange}
      >
        {img1?.img.uploading ? <> Uploading </> : "Upload an Image"}
      </Files>
      <input onChange={attr1OnChange} />
    </div>

    <button onClick={minting}>Mint</button>

    {ipfs ? <div>{JSON.stringify(ipfs)}</div> : ""}
  </div>
);
