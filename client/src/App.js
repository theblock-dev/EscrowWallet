import logo from './logo.svg';
import {getWeb3, getContract} from './Utils.js';
import React, { useEffect, useState } from 'react';

function App() {

  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(undefined);

  useEffect(()=>{

    const init = async() =>{
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const contract = await getContract(web3);

      setWeb3(web3);
      setAccounts(accounts);
      setContract(contract);
      showBalance(contract);
    }

    init();
  },[]);

  //get balance of escrow smart contract
  const showBalance = async(contract) =>{
    const balance11 = await contract.methods.balanceOf().call();
    console.log('Smart Contract Balance');
    console.log(balance11);
  }

  const deposit = async(e) =>{
    e.preventDefault();
    await contract.methods.deposit().send({
      from:accounts[1],
      value:web3.utils.toWei('1000', 'wei')
    });
    showBalance(contract);
  }

  const release = async(e) =>{
    e.preventDefault();
    await contract.methods.release().send({
      from:accounts[0],
      value:web3.utils.toWei('1000', 'wei')
    });
  }

  return (

      <div className="container">
        <h1 className="text-center">Escrow</h1>

        <div className="row">
          <div className="col-sm-12">
             <p>Balance: <b></b> wei </p>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12">
            <form>
              <div className="form-group">
                <label htmlFor="deposit">Deposit</label>
                <input type="number" className="form-control" id="deposit" />
              </div>
              <button type="submit" className="btn btn-primary" onClick={e=>{deposit(e)}}>Submit</button>
            </form>
          </div>
        </div>

        <br />

        <div className="row">
          <div className="col-sm-12">
             <button type="submit" className="btn btn-primary" onClick={e=>{release(e)}}>Release</button>
          </div>
        </div>

      </div>
  );
}

export default App;
