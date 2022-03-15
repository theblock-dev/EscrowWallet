const Escrow = artifacts.require('EscroWallet.sol');

module.exports = function(deployer,network, accounts){
    deployer.deploy(Escrow, accounts[1],accounts[2],(web3.utils.toWei('1000','wei')),{from:accounts[0]});
}