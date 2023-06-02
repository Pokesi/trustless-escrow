import { useState, useEffect as effect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import "./App.css";
import { ethers } from "ethers";
import abi from "./abi";
import eAbi from "./escrowAbi";
import toast, { Toaster } from "react-hot-toast";
import { keccak256 } from "@ethersproject/keccak256";
import { BiCopy } from 'react-icons/bi';


type address = `0x${string}`;
const abiCoder = ethers.utils.defaultAbiCoder;

const n: address = "0xBEEF";
const CONTRACT: address = "0x3Ab5189Aac6c3d906C6A8809BeC824064f38957F";

Object.defineProperty(String.prototype, "capitalize", {
  value: function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false,
});

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid #000",
  borderRadius: "15px",
  boxShadow: 24,
  p: 4,
};

type EscrowType = {
  name: string;
  key: string;
  id: number;
};

const types: EscrowType[] = [
  {
    name: "ERC20 <> ERC20",
    key: "20",
    id: 0,
  },
  {
    name: "ERC721 <> ERC721",
    key: "721",
    id: 1,
  },
  {
    name: "ERC20 <> ERC721",
    key: "hybrid",
    id: 2,
  },
];

function getStyles(name: string, item: string[], theme: Theme) {
  return {
    fontWeight: item.indexOf(name) === -1 ? "12" : "21",
  };
}


/**
 * Truncates an ethereum address to the format 0x0000…0000
 * @param address Full address to truncate
 * @returns Truncated address
 */
const truncateAddress = (address: string) => {
  if (address.endsWith("00000")) return "Loading..."
  address =
    address.substring(0, 12) +
    "..." +
    address.substring(address.length - 8, address.length);
  return address;
};

const t = truncateAddress;

type Arguments = {
  user1: address;
  user2: address;
  token1: address;
  token2: address;
  tokenId1?: number;
  tokenId2?: number;
  time: number;
};

const error = (e) => {
  const code = e.message.replace(/ *\([^)]*\) */g, "").capitalize();
  console.error(e)
  toast(
    (t) => (
      <span>
        {code}
        <button onClick={() => toast.dismiss(t.id)} style={{opacity: "0.8", marginLeft: "10px", backgroundColor: "black", color: "white"}}>Dismiss</button>
      </span>
    ),
    {
      duration: 6000,
      icon: "❌",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    }
  );
};

function Home({
  signer,
  connect,
  account,
}: {
  signer: ethers.providers.JsonRpcSigner;
  connect: () => void;
  account: address;
}) {
  const [opened, open] = useState<boolean>(false);
  const [type, setType] = useState<number>(0);
  const [args, setArgs] = useState<Arguments>({
    user1: n,
    user2: n,
    token1: n,
    token2: n,
    tokenId1: 0,
    tokenId2: 0,
    time: 0,
  });
  const handleOpen = () => {
    open(!opened);
  };

  const ROUTER = new ethers.Contract(CONTRACT, abi, signer);

  const setArg = (
    key:
      | "user1"
      | "user2"
      | "token1"
      | "token2"
      | "tokenId1"
      | "tokenId2"
      | "time",
    value: address | number
  ) => {
    const newArgs = { ...args };
    newArgs[key] = value;
    setArgs(newArgs as Arguments);
  };

  const Form = () => {
    const handleChange = (event: SelectChangeEvent) => {
      setType(event.target.value as string);
    };

    return (
      <>
        <FormControl sx={{ mb: 1, mt: 1, width: "100%" }}>
          <InputLabel id="demo-multiple-name-label">Type</InputLabel>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            value={type}
            onChange={handleChange}
            input={<OutlinedInput label="Type" />}
            // MenuProps={MenuProps}
          >
            {types.map((name) => (
              <MenuItem key={name.key} value={name.id}>
                {name.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </>
    );
  };

  return (
    <>
      <Modal
        open={opened}
        onClose={handleOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          alignItems: "center",
          display: "flex",
        }}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            ➕ Create an Escrow
          </Typography>
          <Form />
          <hr style={{ marginTop: "1px" }}></hr>
          <TextField
            id="outlined-basic"
            label="User 1"
            variant="outlined"
            sx={{ mb: 1, width: "100%" }}
            value={args.user1}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setArg("user1", e.target.value as address);
            }}
          />
          <TextField
            id="outlined-basic"
            label="User 2"
            variant="outlined"
            sx={{ mb: 1, width: "100%" }}
            value={args.user2}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setArg("user2", e.target.value as address);
            }}
          />
          <hr></hr>
          <TextField
            id="outlined-basic"
            label="The token user 1 will provide"
            variant="outlined"
            sx={{ mb: 1, mt: 1, width: "100%" }}
            value={args.token1}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setArg("token1", e.target.value as address);
            }}
          />
          <TextField
            id="outlined-basic"
            label="The token user 2 will provide"
            variant="outlined"
            sx={{ mb: 1, width: "100%" }}
            value={args.token2}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setArg("token2", e.target.value as address);
            }}
          />
          <hr></hr>
          {type !== 0 ? (
            <>
              <TextField
                id="outlined-basic"
                label="The tokenId user 1 will provide"
                variant="outlined"
                type="number"
                sx={{ mb: 1, mt: 1, width: "100%" }}
                value={args.tokenId1}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setArg("tokenId1", e.target.value as number);
                }}
              />
              {type == 1 && (
                <TextField
                  id="outlined-basic"
                  label="The tokenId user 2 will provide"
                  variant="outlined"
                  type="number"
                  sx={{ mb: 1, width: "100%" }}
                  value={args.tokenId2}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setArg("tokenId2", e.target.value as number);
                  }}
                />
              )}
              <hr></hr>
            </>
          ) : null}
          <TextField
            id="outlined-basic"
            label="Days until expiration"
            variant="outlined"
            type="number"
            sx={{ mb: 1, mt: 1, width: "100%" }}
            value={args.time}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setArg("time", e.target.value as number);
            }}
          />
          <button
            onClick={() => {
              try {
                if (type === 0) {
                  ROUTER.create20(
                    args?.user1,
                    args?.user2,
                    args?.token1,
                    args?.token2,
                    args?.time * 86400
                  ).catch(error);
                }
                if (type === 1) {
                  ROUTER.create721(
                    args?.user1,
                    args?.user2,
                    args?.token1,
                    args?.token2,
                    args?.tokenId1,
                    args?.tokenId2,
                    args?.time * 86400
                  ).catch(error);
                }
                if (type === 2) {
                  ROUTER.createHybrid(
                    args?.user1,
                    args?.user2,
                    args?.token1,
                    args?.token2,
                    args?.tokenId1,
                    args?.time * 86400
                  ).catch(error);
                }
              } catch (e) {}
            }}
          >
            Start!
          </button>
          <button onClick={connect} style={{ marginLeft: "4px" }}>
            {account ? truncateAddress(account) : "Connect"}
          </button>
          <a
            style={{ marginLeft: "4px" }}
            href={`?id=${args.user1}${args.user2}&type=${type}`}
          >
            Escrow Link
          </a>
        </Box>
      </Modal>
      <h1>Trustless</h1>
      <h2>
        An <b>escrow</b> platform, for when you don't quite trust the other end
        🥷
      </h2>
      <div className="card">
        <button onClick={handleOpen}>Start an escrow</button>
        <p>
          <a href="https://github.com/Pokesi/trustless-escrow#interacting-with-an-escrow">
            Read
          </a>{" "}
          about how to use Trustless
        </p>
      </div>

      <Toaster />
    </>
  );
}

type TokenData = {
  address: address;
  tokenId?: number;
};

function Escrow({
  connect,
  account,
  signer
}:{
  connect: () => void,
  account: address,
  signer: ethers.providers.JsonRpcSigner
}) {
  const [opened, open] = useState<boolean>(false);
  const [tokens, setTokens] = useState<TokenData[]>([
    { address: "0x000000000000000000000000" },
    { address: "0x000000000000000000000000" },
  ]);
  const handleOpen = () => {
    open(!opened);
  };
  const [contract, setContract] = useState<address>();
  const id = new URL(window.location).searchParams.get("id");
  const type = parseInt(
    new URL(window.location).searchParams.get("type") || ""
  );

  const ROUTER = new ethers.Contract(CONTRACT, abi, signer);

  const users = [id?.substring(0, 42), id?.substring(42, 84)]

  const findProvider = (x: ethers.providers.JsonRpcSigner | ethers.providers.JsonRpcProvider): ethers.providers.JsonRpcProvider => {
    return x?.provider ?? x
  }

  effect(() => {
    const getContract = async () => {
      const hashedId = keccak256(abiCoder.encode(
        ["address", "address"],
        users
      ));
      const address = await ROUTER.escrows(hashedId);
      setContract(address);
      const c = new ethers.Contract(address, eAbi, signer);
      const [
        token1,
        token2
      ] = [
        `0x${(await findProvider(signer).getStorageAt(address, 0x00).catch(error)).substring(26, 66)}`,
        `0x${(await findProvider(signer).getStorageAt(address, 0x01).catch(error)).substring(26, 66)}`
      ];

      setTokens([{
        address: token1,
        tokenId: (type !== 0) ? parseInt(await findProvider(signer).getStorageAt(address, 0x06).catch(error), 16) : undefined
      },
      {
        address: token2,
        tokenId: (type === 1) ? parseInt(await findProvider(signer).getStorageAt(address, 0x07).catch(error), 16) : undefined
      }]);

    }

    getContract();
  }, [account, signer])

  let text = "";
  if (type == 0) {
    text = "ERC20 <> ERC20";
  } else if (type == 1) {
    text = "ERC721 <> ERC721";
  } else {
    text = "ERC20 <> ERC721";
  }

  return (
    <>
      <Modal
        open={opened}
        onClose={handleOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          alignItems: "center",
          display: "flex",
        }}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            ⚠️ Confirming Escrow
          </Typography>
          <p>Confirming an escrow is irreversible and must be done before an escrow is executed. Please make sure that the other party has transferred their tokens to the contract before confirming.</p>
          <button
            onClick={() => {
              const c = new ethers.Contract(contract, eAbi, signer);
              c.confirm().catch(error);
            }}
          >
            Confirm ⚠️
          </button>
        </Box>
      </Modal>
      <h1>Escrow ID {t(id?.replaceAll("0x", ""))}</h1>
      <h2>{text}</h2>

      {account ? <><h3>
        User {t(users[0])} provides token {t(tokens[0].address)} {tokens[0]?.tokenId ? `(tokenId #${tokens[0]?.tokenId})` : null} {" "}
        <a href={`https://gobi-explorer.horizen.io/token/${tokens[0].address}`}>
          View on explorer
        </a>
      </h3>
      <h3>
        User {t(users[1])} provides token {t(tokens[1].address)} {tokens[1]?.tokenId ? `(tokenId #${tokens[1]?.tokenId})` : null} {" "}
        <a href={`https://gobi-explorer.horizen.io/token/${tokens[1].address}`}>
          View on explorer
        </a>
      </h3></> : null}

      {!account ? <button onClick={connect}>Connect to View</button> : null} 

      {(account?.toUpperCase() === users[0]?.toUpperCase()) ? <p>
        You are <b>User 1</b>, send your tokens to <a href={`https://gobi-explorer.horizen.io/address/${contract}`}>{contract}</a> <button onClick={() => {navigator.clipboard.writeText(contract)}}><BiCopy /></button>
      </p> : null}
      {(account?.toUpperCase() === users[1]?.toUpperCase()) ? <p>
        You are <b>User 2</b>, send your tokens to <a href={`https://gobi-explorer.horizen.io/address/${contract}`}>{contract}</a> <button onClick={() => {navigator.clipboard.writeText(contract)}}><BiCopy /></button>
      </p> : null}

      {account ? <><button onClick={handleOpen} style={{marginLeft: "2px"}}>Start confirm</button>
      <button onClick={() => {
        const c = new ethers.Contract(contract, eAbi, signer);
        c.execute().catch(error);
      }} style={{marginLeft: "2px"}}>Execute</button>
      <button onClick={() => {
        const c = new ethers.Contract(contract, eAbi, signer);
        c.cancel().catch(error);
      }} style={{marginLeft: "2px"}}>Cancel (must be after expiry date)</button></> : null}
      <p><b>❔ How do I pay my part?</b></p>
      <p>Just use your wallet to send the ERC20/ERC721 token to the above address. It's that easy!</p>
      <p><b>❔ How do I cancel?</b></p>
      <p>Click the 'Cancel' button after the expiry date and the tokens will be returned. tokenIds not specified as a part of a trade cannot be retrieved.</p>
      <Toaster />
    </>
  );
}

function App() {
  const url = window.location;
  const params = new URL(url).searchParams;

  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | ethers.providers.JsonRpcProvider>(new ethers.providers.JsonRpcProvider("https://gobi-testnet.horizenlabs.io/ethv1", 1663));
  const [account, setAccount] = useState<address>();

  const connectWallet = async () => {
    // @ts-ignore
    window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "1663",
          rpcUrls: ["https://gobi-testnet.horizenlabs.io/ethv1"],
          chainName: "Horizen Gobi",
          nativeCurrency: {
            name: "tZEN",
            symbol: "tZEN",
            decimals: 18,
          },
          blockExplorerUrls: ["https://gobi-explorer.horizen.io/"],
        },
      ],
    });
    6;

    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum, 1663);
    let signer = provider.getSigner();
    setSigner(signer);
    let accounts = await provider.send("eth_requestAccounts", []);
    let account = accounts[0];
    setAccount(account);
  };

  if (params.get("id")) {
    return <Escrow connect={connectWallet} account={account} signer={signer}/>;
  }
  return <Home signer={signer} connect={connectWallet} account={account} />;
}

export default App;
