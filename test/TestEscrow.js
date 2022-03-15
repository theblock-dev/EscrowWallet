const { expectRevert } = require("@openzeppelin/test-helpers");
const { web3 } = require("@openzeppelin/test-helpers/src/setup");

const Escrow = artifacts.require('EscroWallet.sol');

contract('EscroWallet', (accounts)=>{
    let escrowContract = undefined;

    const [lawyer, payer, payee] = accounts;  //accounts[0] is lawyer

    beforeEach(async()=>{
        escrowContract = await Escrow.deployed();
    })

    it('should deposit ether to smart contract', async()=>{
        const contractBalance = await web3.eth.getBalance(escrowContract.address);
        console.log(contractBalance);
        console.log((await escrowContract.amount()).toString());
        await escrowContract.deposit({
            from:payer,
            value:web3.utils.toWei('1000','wei')
        });

        const balance = await web3.eth.getBalance(escrowContract.address);
        console.log(balance);
        assert(balance === web3.utils.toWei('1000','wei'));
    })

    it('should not deposit if sender is not payer', async()=>{
        await expectRevert(
            escrowContract.deposit({from:accounts[5],value:2000}),
            'only payer can deposit ether'
        );
    });

    it('should not allow deposit an amount larger than mentioned in escrow', async()=>{
        await expectRevert(
            escrowContract.deposit({from:accounts[1],value:2000}),
            'Can not send more than Escrow Amount'
        );
    });



    it('only lawyer can release the funds', async() =>{
        await expectRevert(
            escrowContract.release({from:accounts[5]}),
            'only lawyer can release the funds'
        );
    });

    // it('should not release funds if full amount is not received in escrow account', async()=>{
    //     console.log('balance of escrow2222s');
    //     console.log(await web3.eth.getBalance(escrowContract.address));
        
    //     await expectRevert(
    //         escrowContract.release({from:accounts[0]}),
    //         'can not release funds if full amount not received'
    //     );
    // });

    it('should release funds to payee correctly', async()=>{
        const balanceBefore = await web3.eth.getBalance(payee);
        console.log(balanceBefore);
        console.log('balance of escrow');
        console.log(await web3.eth.getBalance(escrowContract.address));
        await escrowContract.release({from:accounts[0]});

        const balanceAfter = await web3.eth.getBalance(payee);

     console.log(balanceAfter);
    })

})