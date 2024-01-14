const { expect } = require('chai');
const { ethers, upgrades } = require('hardhat');



describe("Testing2", function() {

    let Testing2;
    let testing2;
    let owner;
    let receiver;
    let nonOwner;
    
    before(async () => {
        Testing2 = await ethers.getContractFactory("Testing2");
        [owner, receiver, nonOwner, ...others] = await ethers.getSigners();
    
        
            testing2 = await upgrades.deployProxy(Testing2, [owner.address], {kind : 'uups'}, {initializer : 'initalize'});
            console.log("Contract deployed to:", testing2.address);
     
        
    });
    
     //This test checks if the owner of the contract is set correctly after deployment
describe("Deployment", function() {
    it("Should set the right owner", async function() {
        expect(await testing2.owner()).to.equal(owner.address);
    });
});

// This test checks if the contract is deployed correctly by checking if the contract address is not null 
describe("Deployment2", function() {
    it("Should deploy Testing2 contract", async function() {
        // log the contract address
        console.log(testing2.address);
        expect(testing2.address).to.not.be.null;
    });
});


//test to check if the contract is deployed correctly by checking if the contract address is valid contract address 
   
 describe("Deployment2", function() { 

    it("Should deploy Testing2 contract", async function() {    
        // log the contract address
        console.log(testing2.address);
        expect(ethers.isAddress(testing2.address)).to.equal(true);
    });







// // This test checks if the totalSupply function returns the correct total supply of tokens, which should be 0 initially
// describe("totalSupply", function() {
//     it("Should return total supply", async function() {
//         expect(await testing2.totalSupply()).to.equal(0);
//     });
// });

// // This test checks if the supportsInterface function returns true for the ERC721 interface
// describe("supportsInterface", function() {
//     it("Should return true", async function() {
//         expect(await testing2.supportsInterface("0x80ac58cd")).to.equal(true);
//     });
// });

// // This test checks if the freeSafeMint function mints a new token and increases the total supply by 1
// describe("freeSafeMint", function() {
//     it("Should mint 1 NFT", async function() {
//         const isPaused = await testing2.paused();
//         if (isPaused) {
//             await testing2.connect(owner).unpause(); // Ensure the contract is not paused
//         }
//         await testing2.connect(owner).freeSafeMint();
//         const totalSupply = await testing2.totalSupply();
//         expect(totalSupply.toString()).to.equal('1');
//     });
// });

// // This test checks if the pause function pauses the contract
// describe("pause", function() {
//     it("Should pause the contract", async function() {
//         await testing2.pause();
//         expect(await testing2.paused()).to.equal(true);
//     });
// });

// // This test checks if the unpause function unpauses the contract
// describe("unpause", function() {
//     it("Should unpause the contract", async function() {
//         await testing2.unpause();
//         expect(await testing2.paused()).to.equal(false);
//     });
// });

// // This test checks if the contractBalance function returns the correct balance of the contract, which should be 0 initially
// describe("contractBalance", function() {
//     it("Should return contract balance", async function() {
//         expect(await testing2.contractBalance()).to.equal(0);
//     });
// });

// // This test checks if the withdraw function withdraws the correct amount of ether from the contract

// describe("withdraw", function() {
//     it("Should withdraw ether from the contract", async function() {

// // console.log(ethers);
// // console.log(ethers.utils);
//         // Send some Ether to the contract

//         // fetch contract address of deployed contract
//         const contractAddress = testing2.address;
//         console.log(contractAddress);


//         await owner.sendTransaction({
//             to: testing2.address,
//             value: ethers.parseEther('1') // Sending 1 Ether
//         });

//         // Now call the withdraw function
//         await testing2.connect(owner).withdraw();

//         // Check if the contract balance is 0
//         expect(await testing2.contractBalance()).to.equal(0);
//     });
// });



// // This test checks if the withdraw function reverts when a non-owner tries to withdraw ether from the contract
// describe("withdraw", function() {
//     it("Should revert", async function() {
//         // Send some Ether to the contract
//         await owner.sendTransaction({
//             to: testing2.address,
//             value: ethers.utils.parseEther("1.0") // Sending 1 Ether
//         });

//         // Now call the withdraw function
//         await expect(testing2.connect(nonOwner).withdraw()).to.be.revertedWith("Ownable: caller is not the owner");
//     });
// });

// // This test checks if the withdraw function reverts when the contract is paused

// describe("withdraw", function() {
//     it("Should revert", async function() {
//         await owner.sendTransaction({
//             to: testing2.address,
//             value: ethers.utils.parseEther("1.0") // Sending 1 Ether
//         });
//         await testing2.pause();
//         await expect(testing2.connect(owner).withdraw()).to.be.revertedWith("Pausable: paused");
//     });
// });

// // This test checks _setBaseURI function sets the correct base URI

// describe("_setBaseURI", function() {
//     it("Should set the correct base URI", async function() {
//         await testing2.connect(owner)._setBaseURI("https://google.com");
//         expect(await testing2.baseURI()).to.equal("https://google.com");
//     });
// });


// // This test checks _setBaseURI function reverts when a non-owner tries to set the base URI

// describe("_setBaseURI", function() {
//     it("Should revert", async function() {
//         await expect(testing2.connect(nonOwner)._setBaseURI("https://google.com")).to.be.revertedWith("Ownable: caller is not the owner");
//     });
// });



// // This test checks if the tokenURI function returns the correct token URI


// describe("tokenURI", function() {
//     it("Should return the correct token URI", async function() {
//         expect(await testing2.tokenURI(0)).to.equal("https://google.com0");
//     });
// });



// // This test checks if the  setFirstXFreeMint function mints the correct number of tokens for free

// describe("setFirstXFreeMint", function() {
//     it("Should mint 5 NFTs for free", async function() {
//         await testing2.connect(owner).setFirstXFreeMint(5);
//         const totalSupply = await testing2.totalSupply();
//         expect(totalSupply.toString()).to.equal('6');
//     });
// });



// // This test checks if the  setFirstXFreeMint function reverts when a non-owner tries to mint tokens for free

// describe("setFirstXFreeMint", function() {
//     it("Should revert", async function() {
//         await expect(testing2.connect(nonOwner).setFirstXFreeMint(5)).to.be.revertedWith("Ownable: caller is not the owner");
//     });
// });


// // This test checks if the  setFirstXFreeMint function reverts when the contract is paused

// describe("setFirstXFreeMint", function() {
//     it("Should revert", async function() {
//         await testing2.pause();
//         await expect(testing2.connect(owner).setFirstXFreeMint(5)).to.be.revertedWith("Pausable: paused");
//     });
// });







});


});
