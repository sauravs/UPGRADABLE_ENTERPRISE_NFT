// const { expect } = require('chai');
// const { ethers, upgrades } = require('hardhat');





// describe("EnterpriseNFT", function() {
//   let EnterpriseNFT;
//   let enterpriseNFT;
//   let owner;
//   let receiver;
//   let nonOwner;

//   before(async () => {
//     EnterpriseNFT = await ethers.getContractFactory("EnterpriseNFT");
//     [owner, receiver, nonOwner, ...others] = await ethers.getSigners();


//     enterpriseNFT = await upgrades.deployProxy(EnterpriseNFT, [owner.address], {kind : 'uups'}, {initializer : 'initalize'});
//    // console.log(enterpriseNFT.address);

    
//   });

 
//   describe("Deployment", function() {
//     it("Should set the right owner", async function() {
//       expect(await enterpriseNFT.owner()).to.equal(owner.address);
    
//   });

// });


//   describe("Deployment2", function() {
//     it("Should deploy EnterpriseNFT contract", async function() {
//       expect(enterpriseNFT.address).to.not.be.null;
//       //log the enterpriseNFT address
//       //  console.log(enterpriseNFT.address);
//     });
//   });


//     describe("totalSupply", function() {
//       it("Should return total supply", async function() {
//         expect(await enterpriseNFT.totalSupply()).to.equal(0);
//       });
//     });

//     describe("supportsInterface", function() {
//       it("Should return true", async function() {
//         expect(await enterpriseNFT.supportsInterface("0x80ac58cd")).to.equal(true);
//       });
//     });

//     describe("tokenURI", function() {
//       it("Should return token URI", async function() {
//         await enterpriseNFT.safeMint(receiver.address, "https://tokenUri.com");
//         expect(await enterpriseNFT.tokenURI(0)).to.equal("https://tokenUri.com");
//       });
//     });

//     describe("safeMint", function() {
//       it("Should mint token", async function() {
//         await enterpriseNFT.safeMint(receiver.address, "https://tokenUri.com");
//         expect(await enterpriseNFT.totalSupply()).to.equal(2);
//       });
//     });

//     // unit test to verify proper working of upgradeTo function
//    describe("upgradeTo", function() {
//      it("Should upgrade to new implementation", async function() {

//     EnterpriseNFT = await ethers.getContractFactory("EnterpriseNFT");
//     EnterpriseNFTV2 = await ethers.getContractFactory("EnterpriseNFTV2");

//     const instance = await upgrades.deployProxy(EnterpriseNFT, [owner.address], {kind : 'uups'}, {initializer : 'initalize'});
//     const upgraded = await upgrades.upgradeProxy(await instance.getAddress(), EnterpriseNFTV2);
    
//     //  verifies that EnterpriseNFTVVersion() function in EnterpriseNFTV2 contract returns 2 and that contract is successfully upgraded

//     const version = await upgraded.EnterpriseNFTVVersion();
//     expect(version.toString()).to.equal('2');

//   });
// });
  

// });