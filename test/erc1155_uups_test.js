const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC1155_UUPS", function () {
  let ERC1155_UUPS, erc1155_uups, owner, addr1 , addr2;


  before(async () => {
    ERC1155_UUPS = await ethers.getContractFactory("ERC1155_UUPS");
    [owner, receiver, nonOwner1, nonOwner2, nonOwner3, nonOwner4, ...others] = await ethers.getSigners();

    // erc1155_uups = await ERC1155_UUPS.deploy();
    // await erc1155_uups.deployed();
    // await erc1155_uups.initialize();

    erc1155_uups = await upgrades.deployProxy(
        ERC1155_UUPS,
        [],
        { kind: "uups" },
        { initializer: "initalize" }
    );

  });


   // Testing deployment related functionality
   describe("Deployment", function () {
    it("Should set the right owner after deployment", async function () {
      expect(await erc1155_uups.owner()).to.equal(owner.address);
    });

    it("Checking if the deployed contract is not null and valid contract address", async function () {
      console.log(erc1155_uups.address);
      expect(erc1155_uups.address).to.not.be.null;
    });
  });


      // Testing totalSupply Related Functionality

    describe("totalSupply", function () {
        it("Should return the total supply of the token", async function () {
            expect(await erc1155_uups.totalSupply()).to.equal(0);
        });
    });


     // Testing Pause/Unpause Functionality

  describe("Testing Pause/Unpause Functionality", function () {
    it("Only Owner should pause the contract", async function () {
      await erc1155_uups.pause();
      expect(await erc1155_uups.paused()).to.equal(true);
    });

    it("Only Owner should unpause the contract", async function () {
      await erc1155_uups.unpause();
      expect(await erc1155_uups.paused()).to.equal(false);
    });

    it("Non-Owner should not be able to pause the contract", async function () {
      await expect(erc1155_uups.connect(nonOwner1).pause()).to.be.reverted;
    });

    it("Non-Owner should not be able to unpause the contract", async function () {
      await expect(erc1155_uups.connect(nonOwner1).unpause()).to.be.reverted;
    });



  });



  // Testing Basic Contract MetaData Related Functionality


  describe("Testing Basic Contract MetaData Related Functionality", function () {

    it("Should return the name of the token", async function () {
      expect(await erc1155_uups.getName()).to.equal("AnkitTesting18");
    });

    it("Should return the symbol of the token", async function () {
      expect(await erc1155_uups.getSymbol()).to.equal("AnkitTest18");
    });


    it("Should return max supply of the token", async function () {
       expect(await erc1155_uups.getmaxSupply()).to.equal(10000);
    });

    it("should return correct price set by the owner", async function () {
      let price = ethers.parseEther("10"); 
      expect(await erc1155_uups.mintingPrice()).to.equal(price);
    });

  });


  // Testing URI Related Functionality

  describe.skip("Testing URI Related Functionality", function () {
    it("should return the correct URI for a valid token ID", async () => {
     
      // Mint the token before trying to access its URI
      const tokenId = 1;
      await erc1155_uups.connect(owner).mint(owner.address, tokenId, 1);
      
      const expectedUri = "https://ipfs.io/ipfs/QmZKHp2YTDT217YoLQSnpBVA8o65nkGRSiffcSfnMfPBrT" + tokenId + ".json";
      expect(await erc1155_uups.uri(tokenId)).to.equal(expectedUri);
    });


    

  
});


 // Testing price related functionality

  describe("Testing price related functionality", function () {
    it("Only Owner should be able to change the price", async function () {
      let newPrice = ethers.parseEther("20");
      await erc1155_uups.connect(owner).priceChange(newPrice);
      expect(await erc1155_uups.mintingPrice()).to.equal(newPrice);
    });
  
    it("Non-Owner should not be able to change the price", async function () {
      let newPrice = ethers.parseEther("30");
      await expect(erc1155_uups.connect(nonOwner1).priceChange(newPrice)).to.be.reverted;
    });
  
    it("Should return correct price set by the owner", async function () {
      let price = ethers.parseEther("20");
      expect(await erc1155_uups.mintingPrice()).to.equal(price);
    });

    
    



});




// Testing public Mint Related Functionality

describe("Testing public Mint Related Functionality", function () {


  it("Should mint the token to the receiver address", async function () {
   
      // Set the price and max supply
  const price = ethers.parseEther("2");
  const maxSupply = 1000;
  await erc1155_uups.connect(owner).priceChange(price);

  //console.log("price", await erc1155_uups.mintingPrice());

  // Mint the token
  let tokenId = 1;
  let amount = 2;
  let totalPrice = price*BigInt(amount);
  await erc1155_uups.connect(receiver).mint(receiver.address, tokenId, amount, { value: totalPrice});

  // Check the token balance of the address
  const balance = await erc1155_uups.balanceOf(receiver.address, tokenId);
  expect(balance).to.equal(amount);

  // Check the contract balance
  const contractBalance = await  erc1155_uups.contractBalance();
  expect(contractBalance).to.equal(totalPrice);

  });

  // withdraw the contract balance by the owner

  it("Only Owner should be able to withdraw the contract balance", async function () {

    let fundRecevierAddress = "0x911783781755C7A8cE91898C6E19ee057ba94dB6";
    let contractBalance = await  erc1155_uups.contractBalance();
    //console.log("contractBalance", contractBalance);

    await erc1155_uups.connect(owner).withdraw();
    expect(await  erc1155_uups.contractBalance()).to.equal(0);

  });

  it("Non-Owner should not be able to withdraw the contract balance", async function () {
    await expect(erc1155_uups.connect(nonOwner1).withdraw()).to.be.reverted;
  });




});



// Only Owner can mint NFTs to any specific address


describe("Only Owner can mint NFTs to any specific address", function () {

it("Only Owner should be able to mint NFTs to any specific address", async function () {
  let tokenId = 2;
  let amount = 2;
  await erc1155_uups.connect(owner).ownerMint(receiver.address, tokenId, amount);
  const balance = await erc1155_uups.balanceOf(receiver.address, tokenId);
  expect(balance).to.equal(amount);
});

  it("Revert if non-owner tries to mint NFTs to any specific address", async function () {
    let tokenId = 2;
    let amount = 2;
    await expect(erc1155_uups.connect(nonOwner1).ownerMint(receiver.address, tokenId, amount)).to.be.reverted;
  });

  it.skip("Reverts if nextTokenId exceeds maxsupply", async function () {

    let maxSupply = await erc1155_uups.getmaxSupply();
    let nextTokenId = await erc1155_uups.getnextTokenId();

    nextTokenId = maxSupply + 1;

    let tokenId = nextTokenId;

    let amount = 2;

    await expect(erc1155_uups.connect(owner).ownerMint(receiver.address, tokenId, amount)).to.be.revertedWith("Limited limit");


  });

});


// Testing Owner mint multiple ids with multiple amounts to a Wallet address


describe("Testing Owner mint multiple ids with multiple amounts to a Wallet address", function () {

  it("Only Owner should be able to mint multiple ids with multiple amounts to a Wallet address", async function () {

    // Mint the tokens
    const ids = [1,2,3];
    const amounts = [2,3,4];
    await erc1155_uups.connect(owner).ownerMintBatch(nonOwner4.address, ids, amounts);

    // Check the token balances of the address
    for (let i = 0; i < ids.length; i++) {
      const balance = await erc1155_uups.balanceOf(nonOwner4.address, ids[i]);
      expect(balance).to.equal(amounts[i]);
    }
  });


  it ("Revert if non-owner tries to mint multiple ids with multiple amounts to a Wallet address", async function () {
    let ids = [4,5,6];
    let amounts = [2,3,4];
    await expect(erc1155_uups.connect(nonOwner1).ownerMintBatch(nonOwner4.address, ids, amounts)).to.be.reverted;
  
  });

  it("Reverts if Ids and Token amounts does not matches", async function () {
    let ids = [7,8,9];
    let amounts = [2,3];
    await expect(erc1155_uups.connect(owner).ownerMintBatch(nonOwner4.address, ids, amounts)).to.be.reverted;with("Length should match");
  });

  
  it("Reverts if Max Limit Reached", async function () {
    let ids = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21];
    let amounts = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
    await expect(erc1155_uups.connect(owner).ownerMintBatch(nonOwner4.address, ids, amounts)).to.be.reverted;with("Max Limit Reached");
  });

});

});


// Testing VIP Related Functionality  

describe("Testing VIP Related Functionality", function () {

  it("Owner should be able to add VIP", async function () {

    ERC1155_UUPS = await ethers.getContractFactory("ERC1155_UUPS");

    
    erc1155_uups = await upgrades.deployProxy(
      ERC1155_UUPS,
      [],
      { kind: "uups" },
      { initializer: "initalize" }
  );

  [owner, receiver, nonOwner1, nonOwner2, nonOwner3, nonOwner4, ...others] = await ethers.getSigners();


    // Add the addresses to the VIP list
    const users = [nonOwner1.address, nonOwner2.address];
    const allowTokens = 2;
    await erc1155_uups.connect(owner).addVIPList(users, allowTokens);

    // Check if the addresses are in the VIP list
    for (let i = 0; i < users.length; i++) {
      const isVIP = await erc1155_uups.checkVIP(users[i]);
      expect(isVIP).to.equal(allowTokens);
    }
  });


  it("Already Added VIP Members should be able to Mint their respective configured NFTs", async function () {

    // Add the addresses to the VIP list
    const users = [nonOwner3.address, nonOwner4.address];
    const allowTokens = 5;
    await erc1155_uups.connect(owner).addVIPList(users, allowTokens);


  const price = ethers.parseEther("0.1");

  let tokenId = 1;
  let amount = 1;
  let totalPrice = price * BigInt(amount);

    // Mint the token

    await erc1155_uups.connect(nonOwner3).mintVIPList(tokenId, amount, { value: totalPrice});

  });

  });








