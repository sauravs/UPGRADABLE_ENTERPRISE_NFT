
// pragma solidity ^0.8.0;

// import {ModuleContract1} from "./ModuleContract1.sol";
// import {ModuleContract2} from "./ModuleContract2.sol";

// contract MainContract {
//     address private moduleContract1;
//     address private moduleContract2;

//     constructor(address _moduleContract1, address _moduleContract2) {
//         moduleContract1 = _moduleContract1;
//         moduleContract2 = _moduleContract2;
//     }

//     function performAction() external {
//         require(moduleContract1 != address(0), "ModuleContract1 not set");
//         require(moduleContract2 != address(0), "ModuleContract2 not set");

//         ModuleContract1(moduleContract1).callModuleContract1();
//         ModuleContract2(moduleContract2).callModuleContract2();
//     }
// }





// pragma solidity ^0.8.20;

// import {MultipleCopyNFT} from "./multipleCopyNFTContract.sol";

// import {SingleCopyNFT} from "./singleCopyNFTContract.sol";


// contract Gateway {

//     address private singleCopyNFTContract;
//     address private multipleCopyNFTContract;

//     constructor(address _singleCopyNFTContract, address _multipleCopyNFTContract) {
//         singleCopyNFTContract = _singleCopyNFTContract;
//         multipleCopyNFTContract = _multipleCopyNFTContract;
//     }

//     function chooseSingleCopyNFT() external {
//         require(singleCopyNFTContract != address(0), "SingleCopyNFT contract not set");
//         SingleCopyNFT(singleCopyNFTContract).callSingleCopyNFT();
//     }

//     function chooseMultipleCopyNFT() external {
//         require(multipleCopyNFTContract != address(0), "MultipleCopyNFT contract not set");
//         MultipleCopyNFT(multipleCopyNFTContract).callMultipleCopyNFT();
//     }
// }