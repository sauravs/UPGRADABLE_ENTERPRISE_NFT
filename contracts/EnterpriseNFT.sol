// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.20;

// import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
// import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
// import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
// import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
// import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
// import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";


// contract EnterpriseNFT is Initializable, ERC721Upgradeable,ERC1155Upgradeable,ERC721URIStorageUpgradeable, OwnableUpgradeable, UUPSUpgradeable {
//     uint256 private _nextTokenId;

//     /// @custom:oz-upgrades-unsafe-allow constructor
//     constructor() {
//         _disableInitializers();
//     }




//     function initialize(address initialOwner) initializer public {
//         __ERC721_init("MyToken", "MTK");
//         __ERC721URIStorage_init();
//         __Ownable_init(initialOwner);
//         __UUPSUpgradeable_init();
//         __ERC1155_init("MyToken", "MTK"); // Initialize ERC1155
//     }

//     function safeMint(address to, string memory uri) public onlyOwner {
//         uint256 tokenId = _nextTokenId++;
//         _safeMint(to, tokenId);
//         _setTokenURI(tokenId, uri);
//     }

//     function _authorizeUpgrade(address newImplementation)
//         internal
//         onlyOwner
//         override
//     {}

//    function upgradeTo(address newImplementation) external {
    
//     }

   
//     // The following functions are overrides required by Solidity.

//     function tokenURI(uint256 tokenId)
//         public
//         view
//         override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
//         returns (string memory)
//         {
//             return super.tokenURI(tokenId);
//         }

//         function supportsInterface(bytes4 interfaceId)
//             public
//             view
//             override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
//             returns (bool)
//         {
//             return super.supportsInterface(interfaceId);
//         }

//         function totalSupply() public view returns (uint256) {
//             return _nextTokenId;
//         }

//         //write a function to return the version of the contract
//         function EnterpriseNFTVersion() external pure returns (uint256)  {
//             return 1;
//         }


        
//     function batchMint(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) public onlyOwner {
//         for (uint256 i = 0; i < ids.length; i++) {
//             _mint(to, ids[i], amounts[i], data); // Use ERC1155's _mint function
//             _setTokenURI(ids[i], string(abi.decode(data, (string)))); // Assuming URI data is encoded
//         }
//         _nextTokenId = _nextTokenId.add(ids.length); // Update next token ID
//     }


  
        
//     }
