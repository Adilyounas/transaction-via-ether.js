import React, { useState } from "react";

import { ethers, formatEther, parseEther } from "ethers";

import "./matamaskConnection.css";

const Matamask = () => {
  const [errorMessage, setErrorMessage] = useState(null);

  const [defaultAccount, setDefaultAccount] = useState(null);
  const [signerState, setSignerState] = useState(null);
  const [providerState, setProviderState] = useState(null);
  const [balanceState, setBalanceState] = useState(null);
  const [InputReciever, setInputReciever] = useState("");
  const [InputValue, setInputValue] = useState("");

  const connectWallet = async () => {
    if (window.ethereum == null) {
      let provider;
      // If MetaMask is not installed, we use the default provider,
      console.log("MetaMask not installed; using read-only defaults");
      provider = ethers.getDefaultProvider();
      setProviderState(provider);
      return false;
    } else {
     try {
        let provider;
        let signer;
        let address;
        let balance;
  
        // protocol that allows Ethers access to make all read-only
        // requests through MetaMask.
        provider = new ethers.BrowserProvider(window.ethereum);
        setProviderState(provider);
  
        // It also provides an opportunity to request access to write
        // operations, which will be performed by the private key
        signer = await provider.getSigner();
        address = await signer.getAddress();
        balance = await provider.getBalance(address);
        const formatedEthers = formatEther(balance);
        setDefaultAccount(address);
        setSignerState(signer);
        setBalanceState(formatedEthers);
     } catch (error) {
      setErrorMessage(`Failed to send transaction: ${error.message}`);
        
     }
    }
  };

  const sendTransactionHandler = async (e) => {
    e.preventDefault();
    const transactionObject = {
      // from :defaultAccount,
      to: InputReciever,
      value: parseEther(InputValue),
    };

    try {
      const txResponse = await signerState.sendTransaction(transactionObject);
      await providerState.waitForTransaction(txResponse.hash);
      setErrorMessage(null);
      setInputReciever("");

      setInputValue("");
    } catch (error) {
      setErrorMessage(`Failed to send transaction: ${error.message}`);
    }
  };

  const InputValueChangeHandler = (e) => {
    const { name, value } = e.target;
    if (name === "to") {
      setInputReciever(value);
    } else {
      setInputValue(value);
    }
  };

  return (
    <>
      <div className="container">
        <div className="title">🦊 Metamask 🦊</div>
        <button className="button" onClick={connectWallet}>
          <span className="emoji">🔗</span> Connect
        </button>

        <div className="info">
          <h3>{`Account Address: ${defaultAccount}`}</h3>
          <h3>{`Balance: ${balanceState} ETH`}</h3>
          <h3>{errorMessage}</h3>
        </div>

        <form onSubmit={sendTransactionHandler}>
          <input
            name="to"
            type="text"
            id="recipientAddress"
            placeholder="Recipient Address"
            onChange={InputValueChangeHandler}
          />
          <input
            name="value"
            type="text"
            id="amountToSend"
            placeholder="Amount to Send in ETH"
            onChange={InputValueChangeHandler}
          />
          <button type="submit">Send Transaction</button>
        </form>
      </div>
    </>
  );
};

export default Matamask;
