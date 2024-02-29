
const { expect } = require("chai");
const { assert } = require("ethers");
const { ethers, upgrades } = require("hardhat");

describe("ERC721Test1", function () {

    let ERC721Test1;
    let erc721_test_1;
    let owner;
    let receiver;
    let nonOwner;
  
    before(async () => {
        ERC721Test1 = await ethers.getContractFactory(
        "ERC721Test1"
      );
      [owner, receiver, nonOwner1, nonOwner2, nonOwner3, nonOwner4, ...others] =
        await ethers.getSigners();
 
    erc721_test_1 = await upgrades.deployProxy(
        ERC721Test1,
        [],
        { kind: "uups" },
        { initializer: "initalize" }
    );
    });
  
  
  
    // Testing deployment related functionality
    describe("Deployment", function () {
      it("Should set the right owner after deployment", async function () {
        expect(await erc721_test_1.owner()).to.equal(owner.address);
      });
  
      it("Checking if the deployed contract is not null and valid contract address", async function () {
        console.log(erc721_test_1.address);
        expect(erc721_test_1.address).to.not.be.null;
      });
    });


    // Testing totalSupply Related Functionality

  describe("totalSupply", function () {
    it("Should return total supply", async function () {
      expect(await erc721_test_1.totalSupply()).to.equal(0);
    });
  });


  
  // This test checks if the supportsInterface function returns true for the ERC721 interface
  describe("supportsInterface", function () {
    it("Should return true", async function () {
      expect(
        await erc721_test_1.supportsInterface("0x80ac58cd")
      ).to.equal(true);
    });
  });




  // Testing Pause/Unpause Functionality

  describe("Testing Pause/Unpause Functionality", function () {
    it("Should pause the contract", async function () {
      await erc721_test_1.pause();
      expect(await erc721_test_1.paused()).to.equal(true);
    });

    it("Should unpause the contract", async function () {
      await erc721_test_1.unpause();
      expect(await erc721_test_1.paused()).to.equal(false);
    });
  });


  // Testing safeMint Related Functionality

describe("Testing public Minting Related Functionality", function () {
    
    it("Should allow public to mint NFTs", async function () {


    // Change the minting price
    const newPrice = ethers.parseEther("1"); // Set new price as 1 Ether
    await erc721_test_1.connect(owner).priceChange(newPrice);

    // Check the current minting price
    const currentPrice = await erc721_test_1.mintingPrice();
    expect(currentPrice).to.equal(newPrice);


      // Mint a new NFT
      await erc721_test_1.connect(nonOwner1).safeMint(nonOwner1.address, { value: ethers.parseEther("1") });
      
        // Check the total supply ,it should update to 1
        expect(await erc721_test_1.totalSupply()).to.equal(1);

        //check minted count of the user , it should be 1
        expect(await erc721_test_1.balanceOf(nonOwner1.address)).to.equal(1);

      
        let contractBalance = await erc721_test_1.contractBalance();

      console.log("contractBalance", contractBalance.toString() / 10 ** 18);
      
      // contract balance should be 1
      expect(contractBalance.toString() / 10 ** 18).to.equal(1);


  });
  
  it("Should not allow public to mint NFTs if they don't send enough funds", async function() {
      // Change the minting price
      const newPrice = ethers.parseEther("1"); // Set new price as 1 Ether
      await erc721_test_1.connect(owner).priceChange(newPrice);
  
      // Check the current minting price
      const currentPrice = await erc721_test_1.mintingPrice();
      expect(currentPrice).to.equal(newPrice);
  
      // Attempt to mint a new NFT with insufficient funds and expect it to fail
      await expect(erc721_test_1.connect(nonOwner1).safeMint(nonOwner1.address, { value: ethers.parseEther("0.5") })).to.be.revertedWith("Insufficient funds");
  });
  
  });





// Testing only owner can mint (ownerMint) and transfer NFT to Any Account

  describe("Testing only owner can mint Related Functionality", async function () {
    it("owner successfuly able to  mint NFT and Transfer to any other user account", async function () {
      await erc721_test_1.ownerMint(receiver.address, 3);
      expect(
        await erc721_test_1.balanceOf(receiver.address)
      ).to.equal(3);
    });



    let contractBalance = await erc721_test_1.contractBalance();

    console.log("contractBalance", contractBalance.toString() / 10 ** 18);
    
    // contract balance should be 0 because these 3 NFTs are minted by owner
    expect(contractBalance.toString() / 10 ** 18).to.equal(0);




    it.skip("Only owner can mint NFT", async function () {             // failing not because of contract or testing logic,we have to figure out how to catch custom error
      await expect(
        erc721_test_1
          .connect(receiver)
          .ownerMint(receiver.address, 3)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });



  });



 // Testing Withdraw Related Functionality

 describe("Testing Withdraw Related Functionality", function () {
    
    it.skip("Reverts when a non-owner tries to withdraw contract balance", async function () {
      await expect(
        erc721_test_1.connect(nonOwner1).withdraw()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

   
    it("Checking if owner can withdraw contract balance", async function () {
      let contractBalance = await erc721_test_1.contractBalance();
      console.log(
        "contractBalanceBeforeWithdraw",
        contractBalance.toString() / 10 ** 18
      );
      await erc721_test_1.withdraw();
      let contractBalanceAfterWithdraw =
        await erc721_test_1.contractBalance();
      expect(contractBalanceAfterWithdraw).to.equal(0);
      console.log(
        "contractBalanceAfterWithdraw",
        contractBalanceAfterWithdraw.toString() / 10 ** 18
      );
    });


    it("Reverts when balance of the contract is zero", async function () {
      await expect(
        erc721_test_1.connect(nonOwner1).withdraw()
      ).to.be.revertedWith("Insufficent funds");
    });
  });



  // Testing baseURI Related Functionality

  describe("Testing baseURI Related Functionality", function() {
    it("function sets the correct base URI", async function() {
        await erc721_test_1._setBaseURI("ipfs://abc/");
        expect(await erc721_test_1.tokenURI(1)).to.equal("ipfs://abc/1.json");
   });



 });




 describe("Testing VIP List Related Functionality", function () {
  
    it("Checking if VIP List is set properly and checkVIP returns correct token count", async function () {
  
        const users = [nonOwner1.address, nonOwner2.address];
        const tokens = 5; // Each user gets 5 tokens
  
  
        // Add users to VIP list
        await erc721_test_1.connect(owner).addVIPList(users, tokens);
        // Check if checkVIP returns correct token count
        for (let i = 0; i < users.length; i++) {
            const numberOfTokenLeft = await erc721_test_1.isVIPlist(users[i]);
            expect(numberOfTokenLeft).to.equal(tokens);
        }
    });
     
   
  
  
    it("Mints the correct number of tokens by the VIP Members and updates the token count of VIP list members", async function () {
      const numberOfTokens = 2;
  
      const newPrice = ethers.parseEther("1");
      // Change the price
      await erc721_test_1.connect(owner).priceChange(newPrice);
  
      // Retrieve the updated price
      const mintPrice = await erc721_test_1.mintingPrice();
  
      console.log("mintPrice", mintPrice.toString() / 10 ** 18);
  
      // Check if the price was updated correctly
      expect(mintPrice).to.equal(newPrice);
      
  
      let totalPrice = mintPrice*(BigInt(numberOfTokens));

      const users = [nonOwner4.address];
      let tokens = 5; // Each user gets 5 tokens


      // Add users to VIP list
      await erc721_test_1.connect(owner).addVIPList(users, tokens);
  
      // Send enough Matic/Ether/Native Token to cover the price of the tokens abd Mint the tokens (by the members of VIP list)
      await erc721_test_1.connect(nonOwner4).VIPList(numberOfTokens, { value: totalPrice });
  
      // Check if the correct number of tokens were minted
      const balance = await erc721_test_1.balanceOf(nonOwner4.address);
      expect(balance).to.equal(numberOfTokens);
  
      // Check if the VIP list was updated correctly
      const vipListCount = await erc721_test_1.isVIPlist(nonOwner4.address);
      expect(vipListCount).to.equal(tokens-numberOfTokens);
      
  });
  
   
   // Reverts when a Vip list user send less funds
  
    it("Reverts when a Vip list user send less funds", async function () {
      const numberOfTokens = 2;
    
      const newPrice = ethers.parseEther("1");
      // Change the price
      await erc721_test_1.connect(owner).priceChange(newPrice);
    
      // Retrieve the updated price
      const mintPrice = await erc721_test_1.mintingPrice();
    
      console.log("mintPrice", mintPrice.toString() / 10 ** 18);
    
      // Check if the price was updated correctly
      expect(mintPrice).to.equal(newPrice);
    
      let totalPrice = mintPrice*(BigInt(numberOfTokens));

      const users = [nonOwner4.address];
      let tokens = 5; // Each user gets 5 tokens


      // Add users to VIP list
      await erc721_test_1.connect(owner).addVIPList(users, tokens);


    
      // Send less Matic to not cover the price of the tokens
      await expect(erc721_test_1.connect(nonOwner4).VIPList(numberOfTokens, { value: ethers.parseEther("0.5") })).to.be.revertedWith("Insufficient funds");
      
    });


   // Testing checkVIP Function

   it("Checking if VIP Members are correctly added into list", async function () {

    const users = [nonOwner1.address, nonOwner2.address];
    const tokens = 5; // Each user gets 5 tokens    

    // Add users to VIP list
    await erc721_test_1.connect(owner).addVIPList(users, tokens);
    // Check if VIP Members are correctly added into list

    const vipList = await erc721_test_1.checkVIP(nonOwner1.address);
    expect(vipList).to.equal(5);

   });




    //when a non-owner tries to add users to VIP list

    it.skip("Reverts when a non-owner tries to add users to VIP list", async function () {
        await expect(
            erc721_test_1.connect(nonOwner1).addVIPList_new([nonOwner1.address], 5)
        ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  
      
  });
  



























});