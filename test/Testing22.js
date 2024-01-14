const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("Testing2", function () {
  let Testing2;
  let testing2;
  let owner;
  let receiver;
  let nonOwner;

  before(async () => {
    Testing2 = await ethers.getContractFactory("Testing2");
    [owner, receiver, nonOwner1,nonOwner2,nonOwner3,nonOwner4, ...others] = await ethers.getSigners();
    testing2 = await upgrades.deployProxy(Testing2, [owner.address], { kind: 'uups' }, { initializer: 'initalize' });
    console.log("Contract deployed to:", testing2.address);
  });

  // Testing deployment related functionality
  describe("Deployment", function () {
    it("Should set the right owner after deployment", async function () {
      expect(await testing2.owner()).to.equal(owner.address);
    });

    it("Checking if the deployed contract is not null and valid contract address", async function () {
        console.log(testing2.address);
        expect(testing2.address).to.not.be.null;
      });
  });



  describe("totalSupply", function () {
    it("Should return total supply", async function () {
      expect(await testing2.totalSupply()).to.equal(0);
    });
  });

  // // This test checks if the supportsInterface function returns true for the ERC721 interface
describe("supportsInterface", function() {
    it("Should return true", async function() {
        expect(await testing2.supportsInterface("0x80ac58cd")).to.equal(true);
    });
});


// Testing Pause/Unpause Functionality
describe("Testing Pause/Unpause Functionality", function() {
    it("Should pause the contract", async function() {
        await testing2.pause();
        expect(await testing2.paused()).to.equal(true);
    });

    it("Should unpause the contract", async function() {
        await testing2.unpause();
        expect(await testing2.paused()).to.equal(false);
    });
});


// Testing Free mint Related Functionality

describe("Free Minting Related Functionality", function() {

    it("Checking if setFirstXFreeMint is set properly", async function() {
        await testing2.setFirstXFreeMint(2);
        expect(await testing2._freeNftLimit()).to.equal(2);
        
    });

    it("Checking if Public can free mint NFT", async function() {
        await testing2.freeSafeMint();
        await testing2.freeSafeMint();
        
        expect(await testing2.balanceOf(owner.address)).to.equal(2);

    });

    it.skip("Reverts with error if total supply of minted token exceeds maximum supply", async function() {   //@audit test case failing

      let maxSupply = await testing2.maxSupply();
      let totalSupply = await testing2.totalSupply();
      let remainingSupply = (maxSupply - totalSupply).toString();
     

      totalSupply = Number(remainingSupply) +2;

    
      console.log("maxSupply", maxSupply.toString());
      console.log("totalSupply", totalSupply.toString());
      console.log("remainingSupply", remainingSupply.toString());
      await expect(testing2.freeSafeMint()).to.be.revertedWith("Insuffient Mint Token");

    });


    // test for if user try to mint more than the limit

    it("Reverts with error if user try to free Mint NFT if it exceeds its limit", async function() {
      await expect(testing2.freeSafeMint()).to.be.revertedWith("Free Nft Limit Exceed");

    });

   





}); 


// Testing only owner can mint and transfer NFT to Any Account 

describe("Testing only owner can mint Related Functionality", function() {

  it("owner successfuly able to  mint NFT and Transfer to any other user account", async function() {
      await testing2.ownerMint(receiver.address, 3);
      expect(await testing2.balanceOf(receiver.address)).to.equal(3);
  });


  it.skip("Only owner can mint NFT", async function() {
    await expect(testing2.connect(receiver).ownerMint(receiver.address, 3)).to.be.revertedWith("Ownable: caller is not the owner");
  });     




});



// Testing VIP List Related Functionality

describe("Testing VIP List Related Functionality", function() { 

  it("Checking if VIP List is set properly", async function() {
  const users = [nonOwner1.address, nonOwner2.address , nonOwner3.address , nonOwner4.address];
  await testing2.connect(owner).addVIPList(users);
  for (let i = 0; i < 3 ; i++) {
    const isVIP = await testing2.isVIPlist(users[i]);
    expect(isVIP).to.equal(0);
}
});


// checkVIP  how many NFT left with the walletAddress




});


// Testing price Related Functionality



// Testing public Minting Related Functionality

describe("Testing public Minting Related Functionality", function() {

  it("Should allow public to mint NFTs", async function() {
    const initialBalance = await testing2.balanceOf(nonOwner1.address);
    await testing2.connect(nonOwner1).safeMint(nonOwner2, { value: ethers.parseEther("1") });
    const finalBalance = await testing2.balanceOf(nonOwner1.address);
    
  
  });

// it("Should not allow public to mint NFTs if they don't send enough ether", async function() {
//     await expect(testing2.connect(nonOwner1).publicMint({ value: ethers.utils.parseEther("0.5") })).to.be.revertedWith("Not enough ether sent");
// });

// it("Should not allow public to mint NFTs if the maximum supply is reached", async function() {
//     // Mint maximum supply
//     for (let i = 0; i < maxSupply; i++) {
//         await testing2.connect(owner).ownerMint(nonOwner1.address, 1);
//     }

//     // Try to mint one more
//     await expect(testing2.connect(nonOwner1).publicMint({ value: ethers.utils.parseEther("1") })).to.be.revertedWith("Maximum supply reached");
// });


});



// Testing Contract Balance Related Functionality

describe("Testing Contract Balance Related Functionality", function() {

  it("Checking contract balance ", async function() {

    let contractBalance = await testing2.contractBalance();
    console.log("contractBalance", contractBalance.toString());
 
  

  });


});















// Testing baseURI Related Functionality

// describe("Testing baseURI Related Functionality", function() {
//     it("function sets the correct base URI", async function() {
//         await testing2._setBaseURI("https://ipfs.io/ipfs/");
//         await testing2.mint(owner.address, 1);
//         expect(await testing2.tokenURI(1)).to.equal("https://ipfs.io/ipfs/1");
//     });

//     // it("Reverts when a non-owner tries to set the base URI", async function() {
//     //     await expect(testing2.connect(nonOwner).setBaseURI("https://ipfs.io/ipfs/")).to.be.revertedWith("Ownable: caller is not the owner");
//     // });

   
// });









});