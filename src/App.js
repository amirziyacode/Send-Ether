import Web3 from "web3";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [state, setState] = useState({ web3: null });
  const [account, setaccount] = useState("0x");

  async function connectWallet() {
    const accounts = await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .catch((error) => {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          console.log("Please connect to MetaMask.");
        } else {
          console.error(error);
        }
      });

    const account = accounts[0]; // frist accoutn of ten accounts
    document.getElementById("account").innerHTML = account;

    setaccount({ account: account });
  }

  useEffect(() => {

     // this method for ===> reading a account of your privet netework 
    connectWallet();

    const provider = new Web3.providers.HttpProvider("http://localhost:7545");

    async function template() {
      const web3 = new Web3(provider);

      setState({ web3: web3 });
    }

    provider && template();
  }, []);

  // see a block numeber from privat network
  async function getBlock() {
    const { web3 } = state;
    web3.eth.getBlockNumber().then((e) => alert("Block Number " + e));
  }

  // send with web3
  async function SendMoney() {
    const { web3 } = state;

    const obj = {
      account_From: account.account, // # for first account from our accounts
      account_To: document.getElementById("To").value,
      value: document.getElementById("value").value,
    };

    web3.eth.getBalance(account.account).then((balance) => {
      if (balance != 0 && web3.utils.fromWei(balance, "ether") >= obj.value) {

        // TODO : make a transtion ...
        if (obj.account_To && obj.value !== "") {
          web3.eth.sendTransaction({
            from: obj.account_From,
            to: obj.account_To,
            value: web3.utils.toWei(obj.value, "ether"),
          });
          alert("Succsfuly !! ");
        } else {
          alert("It's Emty !!! ");
        }
      } else {
        alert("You don't have Ether");
      }
    });
  }

  // render a template ...
  return (
    <div className="App">
      <header className="App-header">
        <button
          className="button"
          id="account"
          role="button"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
        <div className="input-group">
          <label className="label">Address To</label>
          <input autoComplete="off" id="To" className="input"></input>
          <div></div>
        </div>
        <div className="input-group">
          <label className="label">Ether</label>
          <input
            autoComplete="off"
            type="number"
            id="value"
            className="input"
          ></input>
          <div></div>
        </div>
        <div className="con">
          <button className="senb" onClick={SendMoney}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path
                fill="currentColor"
                d="M5 13c0-5.088 2.903-9.436 7-11.182C16.097 3.564 19 7.912 19 13c0 .823-.076 1.626-.22 2.403l1.94 1.832a.5.5 0 0 1 .095.603l-2.495 4.575a.5.5 0 0 1-.793.114l-2.234-2.234a1 1 0 0 0-.707-.293H9.414a1 1 0 0 0-.707.293l-2.234 2.234a.5.5 0 0 1-.793-.114l-2.495-4.575a.5.5 0 0 1 .095-.603l1.94-1.832C5.077 14.626 5 13.823 5 13zm1.476 6.696l.817-.817A3 3 0 0 1 9.414 18h5.172a3 3 0 0 1 2.121.879l.817.817.982-1.8-1.1-1.04a2 2 0 0 1-.593-1.82c.124-.664.187-1.345.187-2.036 0-3.87-1.995-7.3-5-8.96C8.995 5.7 7 9.13 7 13c0 .691.063 1.372.187 2.037a2 2 0 0 1-.593 1.82l-1.1 1.039.982 1.8zM12 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
              ></path>
            </svg>
            <span>Send</span>
          </button>
          <button className="btn" role="button" onClick={getBlock}>
            Get Blcok Number
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;
