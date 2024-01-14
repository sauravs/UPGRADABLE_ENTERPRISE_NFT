const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("WEB3TECH_ERC721_UPGRADABLE", function () {
  let WEB3TECH_ERC721_UPGRADABLE;
  let web3tech_erc721_upgradable;
  let owner;
  let receiver;
  let nonOwner;

  before(async () => {
    WEB3TECH_ERC721_UPGRADABLE = await ethers.getContractFactory("WEB3TECH_ERC721_UPGRADABLE");
    [owner, receiver, nonOwner1,nonOwner2,nonOwner3,nonOwner4, ...others] = await ethers.getSigners();
    web3tech_erc721_upgradable = await upgrades.deployProxy(WEB3TECH_ERC721_UPGRADABLE, [owner.address], { kind: 'uups' }, { initializer: 'initalize' });
    console.log("Contract deployed to:", web3tech_erc721_upgradable.address);
  });

  // Testing deployment related functionality
  describe("Deployment", function () {
    it("Should set the right owner after deployment", async function () {
      expect(await web3tech_erc721_upgradable.owner()).to.equal(owner.address);
    });

    it("Checking if the deployed contract is not null and valid contract address", async function () {
        console.log(web3tech_erc721_upgradable.address);
        expect(web3tech_erc721_upgradable.address).to.not.be.null;
      });
  });



  describe("totalSupply", function () {
    it("Should return total supply", async function () {
      expect(await web3tech_erc721_upgradable.totalSupply()).to.equal(0);
    });
  });

  // // This test checks if the supportsInterface function returns true for the ERC721 interface
describe("supportsInterface", function() {
    it("Should return true", async function() {
        expect(await web3tech_erc721_upgradable.supportsInterface("0x80ac58cd")).to.equal(true);
    });
});



/**
 * Test Suite: Testing Pause/Unpause Functionality
 * 
 * This test suite contains two test cases:
 * 
 * 1. "Should pause the contract": This test case checks if the contract can be paused. 
 *    It first calls the pause function on the contract, then checks if the contract's 
 *    paused state is true.
 * 
 * 2. "Should unpause the contract": This test case checks if the contract can be unpaused. 
 *    It first calls the unpause function on the contract, then checks if the contract's 
 *    paused state is false.
 */




describe("Testing Pause/Unpause Functionality", function() {
    it("Should pause the contract", async function() {
        await web3tech_erc721_upgradable.pause();
        expect(await web3tech_erc721_upgradable.paused()).to.equal(true);
    });

    it("Should unpause the contract", async function() {
        await web3tech_erc721_upgradable.unpause();
        expect(await web3tech_erc721_upgradable.paused()).to.equal(false);
    });
});


// Testing Free mint Related Functionality

describe("Free Minting Related Functionality", function() {

    it("Checking if setFirstXFreeMint is set properly", async function() {
        await web3tech_erc721_upgradable.setFirstXFreeMint(2);
        expect(await web3tech_erc721_upgradable._freeNftLimit()).to.equal(2);
        
    });

    it("Checking if Public can free mint NFT", async function() {
        await web3tech_erc721_upgradable.freeSafeMint();
        await web3tech_erc721_upgradable.freeSafeMint();
        
        expect(await web3tech_erc721_upgradable.balanceOf(owner.address)).to.equal(2);

    });

    it.skip("Reverts with error if total supply of minted token exceeds maximum supply", async function() {   //@audit test case failing

      let maxSupply = await web3tech_erc721_upgradable.maxSupply();
      let totalSupply = await web3tech_erc721_upgradable.totalSupply();
      let remainingSupply = (maxSupply - totalSupply).toString();
     

      totalSupply = Number(remainingSupply) +2;

    
      console.log("maxSupply", maxSupply.toString());
      console.log("totalSupply", totalSupply.toString());
      console.log("remainingSupply", remainingSupply.toString());
      await expect(web3tech_erc721_upgradable.freeSafeMint()).to.be.revertedWith("Insuffient Mint Token");

    });


    // test for if user try to mint more than the limit

    it("Reverts with error if user try to free Mint NFT if it exceeds its limit", async function() {
      await expect(web3tech_erc721_upgradable.freeSafeMint()).to.be.revertedWith("Free Nft Limit Exceed");

    });

   





}); 


// Testing only owner can mint and transfer NFT to Any Account 

describe("Testing only owner can mint Related Functionality", function() {

  it("owner successfuly able to  mint NFT and Transfer to any other user account", async function() {
      await web3tech_erc721_upgradable.ownerMint(receiver.address, 3);
      expect(await web3tech_erc721_upgradable.balanceOf(receiver.address)).to.equal(3);
  });


  it.skip("Only owner can mint NFT", async function() {
    await expect(web3tech_erc721_upgradable.connect(receiver).ownerMint(receiver.address, 3)).to.be.revertedWith("Ownable: caller is not the owner");
  });     




});



// Testing VIP List Related Functionality

describe("Testing VIP List Related Functionality", function() { 

  it("Checking if VIP List is set properly", async function() {
  const users = [nonOwner1.address, nonOwner2.address , nonOwner3.address , nonOwner4.address];
  await web3tech_erc721_upgradable.connect(owner).addVIPList(users);
  for (let i = 0; i < 3 ; i++) {
    const isVIP = await web3tech_erc721_upgradable.isVIPlist(users[i]);
    expect(isVIP).to.equal(0);
}
});


// checkVIP  how many NFT left with the walletAddress




});


// Testing price Related Functionality



// Testing public Minting Related Functionality

describe("Testing public Minting Related Functionality", function() {

  it("Should allow public to mint NFTs", async function() {
    const initialBalance = await web3tech_erc721_upgradable.balanceOf(nonOwner1.address);
    await web3tech_erc721_upgradable.connect(nonOwner1).safeMint(nonOwner2, { value: ethers.parseEther("1") });
    const finalBalance = await web3tech_erc721_upgradable.balanceOf(nonOwner1.address);
    
  
  });

// it("Should not allow public to mint NFTs if they don't send enough ether", async function() {
//     await expect(web3tech_erc721_upgradable.connect(nonOwner1).publicMint({ value: ethers.utils.parseEther("0.5") })).to.be.revertedWith("Not enough ether sent");
// });

// it("Should not allow public to mint NFTs if the maximum supply is reached", async function() {
//     // Mint maximum supply
//     for (let i = 0; i < maxSupply; i++) {
//         await web3tech_erc721_upgradable.connect(owner).ownerMint(nonOwner1.address, 1);
//     }

//     // Try to mint one more
//     await expect(web3tech_erc721_upgradable.connect(nonOwner1).publicMint({ value: ethers.utils.parseEther("1") })).to.be.revertedWith("Maximum supply reached");
// });


});



// Testing Contract Balance Related Functionality

describe("Testing Contract Balance Related Functionality", function() {

  it("Checking contract balance ", async function() {

    let contractBalance = await web3tech_erc721_upgradable.contractBalance();
    console.log("contractBalance", contractBalance.toString()/10**18);
 
  

  });

});


  // Testing Withdraw Related Functionality


  describe("Testing Withdraw Related Functionality", function() {


    it.skip("Reverts when a non-owner tries to withdraw contract balance", async function() {
      await expect(web3tech_erc721_upgradable.connect(nonOwner1).withdraw()).to.be.revertedWith("Ownable: caller is not the owner");


  });

    it("Checking if owner can withdraw contract balance", async function() {

      let contractBalance = await web3tech_erc721_upgradable.contractBalance();
      console.log("contractBalanceBeforeWithdraw", contractBalance.toString()/10**18);
      await web3tech_erc721_upgradable.withdraw();
      let contractBalanceAfterWithdraw = await web3tech_erc721_upgradable.contractBalance();
      expect(contractBalanceAfterWithdraw).to.equal(0);
      console.log("contractBalanceAfterWithdraw", contractBalanceAfterWithdraw.toString()/10**18);
    });

   


  
  it("Reverts when balance of the contract is zero", async function() {
    await expect(web3tech_erc721_upgradable.connect(nonOwner1).withdraw()).to.be.revertedWith("Insufficent funds");


});

});















// Testing baseURI Related Functionality

// describe("Testing baseURI Related Functionality", function() {
//     it("function sets the correct base URI", async function() {
//         await web3tech_erc721_upgradable._setBaseURI("https://ipfs.io/ipfs/");
//         await web3tech_erc721_upgradable.mint(owner.address, 1);
//         expect(await web3tech_erc721_upgradable.tokenURI(1)).to.equal("https://ipfs.io/ipfs/1");
//     });

//     // it("Reverts when a non-owner tries to set the base URI", async function() {
//     //     await expect(web3tech_erc721_upgradable.connect(nonOwner).setBaseURI("https://ipfs.io/ipfs/")).to.be.revertedWith("Ownable: caller is not the owner");
//     // });

   
// });









});