
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";


/* 

      /* -----------------------------------------------Contract Summary------------------------------------------------------*\

Contract represents a collection of unique, non-fungible tokens (NFTs). It uses the ERC721 standard for NFTs and includes following features:
- minting of unique NFTs using ERC721 standard
- pausing of minting
- burning of NFTs
- ownership of NFTs
- ability to change the base URI for NFTs
- ability to change the price of minting NFTs
- ability to withdraw funds from the contract
- ability to mint NFTs for free
- ability to mint NFTs for VIP users
- ability to add VIP users
- ability to check how many NFTs left for VIP users
- ability to mint NFTs for owner
- ability to change the price of minting NFTs
- ability to change the base URI for NFTs
- ability to pause minting
- ability to unpause minting
- ability to check the balance of the contract
- UUPS upgradeability : The contract is upgradeable using the UUPS pattern. This allows the contract's logic to be upgraded without changing the contract address.

*/






contract Testing2 is Initializable, ERC721Upgradeable, ERC721EnumerableUpgradeable, ERC721PausableUpgradeable, OwnableUpgradeable, ERC721BurnableUpgradeable, UUPSUpgradeable {
    using Strings for uint256;


string private _baseURIextended;
uint256 private _nextTokenId;
uint256 public _freeNftLimit;           //@audit - should be made public to read for testing purpose atleast //updated to public for testing purpose
uint256 private maxSuppy;              //@audit - should be made public to read for testing purpose atleast //updated to public for testing purpose
uint256 private price;
    
    mapping(address=>uint) public isVIPlist; // USER WHITELIST WALLET ADDRESS & Number of Token
    mapping(address => uint256) private _mintedFreeNFTCount; 
    mapping(address => uint256) private _mintedCount;



    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

     // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

    

    
/**
 * @dev Initializes the contract by setting up the necessary ERC721 and ERC721 extensions, as well as the contract's own variables.
 * This function should be called exactly once, immediately after the contract is deployed.
 *
 * @param initialOwner The address that will be granted ownership of the contract.
 */
    

    function initialize(address initialOwner) initializer public {
        __ERC721_init("Testing2", "Test2");
        __ERC721Enumerable_init();
        __ERC721Pausable_init();
        __Ownable_init(initialOwner);
        __ERC721Burnable_init();
        __UUPSUpgradeable_init();
         _baseURIextended = "ipfs://QmPHeiGDhH9yKFAedUxtZ6wGWe5ZZPT3u4SQ4T3RkQQG6U/"; 
             _nextTokenId = 1;
             _freeNftLimit = 10;
             maxSuppy = 1000;
            price = 0;
    }

/**
 * @dev Pauses all token transfers and minting. 
 * This function can only be called by the contract owner.
 * Useful in case of any emergency or maintenance.
 */


    function pause() public onlyOwner {                             //Testing done - result PASSED
        _pause();
    }



 /**
 * @dev Unpauses all token transfers and minting. 
 * This function can only be called by the contract owner.
 * Useful to resume normal contract operations after an emergency or maintenance.
 */

    function unpause() public onlyOwner {                            //Testing done - result PASSED
        _unpause();
    }


/**
 * @dev Authorizes an upgrade to a new contract implementation.
 * This is an internal function that can only be called by the contract owner.
 * It's part of the UUPS (Universal Upgradeable Proxy Standard) pattern for upgradeable contracts.
 *
 * @param newImplementation The address of the new contract implementation.
 */

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}



   /**
 * @dev Updates the state of a token.
 * This is an internal function that overrides the `_update` function from `ERC721Upgradeable`, `ERC721EnumerableUpgradeable`, and `ERC721PausableUpgradeable`.
 *
 * @param to The address to transfer the token to.
 * @param tokenId The ID of the token to transfer.
 * @param auth The address authorized to make the transfer.
 * @return The address that the token was transferred to.
 */




    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable, ERC721PausableUpgradeable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

/**
 * @dev Increases the balance of the specified account.
 * This is an internal function that overrides the `_increaseBalance` function from `ERC721Upgradeable` and `ERC721EnumerableUpgradeable`.
 *
 * @param account The address of the account whose balance will be increased.
 * @param value The amount by which the balance will be increased.
 */



    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
    {
        super._increaseBalance(account, value);
    }

                      

    /**
 * @dev Checks if the contract supports a given interface.
 * This function overrides the `supportsInterface` function from `ERC721Upgradeable` and `ERC721EnumerableUpgradeable`.
 *
 * @param interfaceId The identifier of the interface to check.
 * @return A boolean indicating whether the contract supports the given interface.
 */


    function supportsInterface(bytes4 interfaceId)                                //Testing done - result PASSED
        public
        view
        override(ERC721Upgradeable, ERC721EnumerableUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }


/**
 * @dev Returns the current balance of the contract.
 * @return fund The current balance of the contract in wei.
 */


    function contractBalance() public view returns(uint256 fund) {                  
              return address(this).balance;
          }
      

/**
 * @dev Allows the contract owner to withdraw all funds from the contract.
 * The function first checks that the contract balance is greater than 0, then transfers the entire balance to the owner.
 * This function can only be called externally.
 */



    function withdraw() external {
        uint256 balance = contractBalance();
        require(balance > 0, "Insufficent funds");
        payable(owner()).transfer(balance);
    }


/**
 * @dev Returns the maximum supply of tokens that can be minted.
 *
 * @return numberOFTokenMinted The maximum number of tokens that can be minted.
 */

    function maxSupply() public view returns(uint256 numberOFTokenMinted) {
        return maxSuppy;
    }

  /**
 * @dev Returns the maximum supply of tokens that can be minted.
 *
 * @return numberOFTokenMinted The maximum number of tokens that can be minted.
 */


    function _baseURI() internal view override returns (string memory) {
        return _baseURIextended;
    }


    /**
 * @dev Sets the base URI for the token metadata.
 * This function can only be called by the contract owner.
 *
 * @param baseURI The new base URI for the token metadata.
 */

    function _setBaseURI(string memory baseURI) public onlyOwner {    
        _baseURIextended = baseURI;
    }

    
    
    /**
 * @dev Sets the limit for free NFT minting.
 * This function can only be called by the contract owner.
 *
 * @param _value The new limit for free NFT minting.
 */

    function setFirstXFreeMint(uint256 _value) public onlyOwner{
        _freeNftLimit=_value;
    }


/**
 * @dev Mints a new token for free to the caller of the function.
 * This function can only be called when the contract is not paused.
 * It checks that the total supply of tokens after the minting would not exceed the maximum supply.
 * It also checks that the caller has not exceeded their limit for free minting.
 *
 * @notice The function increments the token ID and the count of free NFTs minted by the caller.
 */


    function freeSafeMint() public whenNotPaused {
        require(totalSupply()+1 <= maxSuppy, "Insuffient Mint Token");                     // @audit incorrect supply spelling // also explain totalsupply()+1
        
        require(_mintedFreeNFTCount[msg.sender]<_freeNftLimit,"Free Nft Limit Exceed");
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _mintedFreeNFTCount[msg.sender]++;
    }




/**
 * @dev Allows a user to mint a specified number of tokens if they are on the VIP list.
 * The user must send enough ether to cover the price of the tokens.
 * A user on the VIP list can mint a maximum of 5 tokens.
 *
 * @param numberOfTokens The number of tokens to mint.
 *
 * @notice The function increments the token ID for each new token and mints the token to the caller.
 * It also increments the count of tokens minted by the caller on the VIP list.
 */



    function VIPList(uint256 numberOfTokens) public payable {
        require(numberOfTokens > 0,"Choose correct Number");
        require(msg.value >= price * (numberOfTokens), "Insufficient funds");
        require(isVIPlist[msg.sender]* numberOfTokens <= 5, "You cannot mint more than 5 NFTs");
        for(uint i = 0; i < numberOfTokens; i++) {
            uint256 newItemId = _nextTokenId++;
            _safeMint(msg.sender, newItemId+1);

        }
        isVIPlist[msg.sender] += numberOfTokens;
    }



/**
 * @dev Checks the number of tokens left that a VIP user can mint.
 *
 * @param walletAddress The address of the VIP user to check.
 * @return numberOfTokenLeft The number of tokens left that the VIP user can mint.
 */


    function checkVIP(address walletAddress) public view returns(uint256) {
        uint256 numberOfTokenLeft = isVIPlist[walletAddress];
        return numberOfTokenLeft;
    }

/**
 * @dev Adds users to the VIP list.
 * This function can only be called by the contract owner.
 *
 * @param _users An array of addresses to be added to the VIP list.
 *
 * @notice The function sets the count of tokens minted by each new VIP user to 0.
 */


   
    function addVIPList(address[] memory _users) public onlyOwner {                  //Testing done
        for (uint i = 0; i < _users.length; i++) {
            isVIPlist[_users[i]] = 0;
        }
    }

    function safeMint(address to) public payable whenNotPaused {
        require(msg.value >= price, "Insufficient funds");
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        payable(address(this)).transfer(msg.value);
    }

    function ownerMint(address to, uint256 _mintNumber) public onlyOwner {            //Testing done
        for (uint256 i = 0; i < _mintNumber; i++) {
            uint256 tokenId = _nextTokenId++;
            _safeMint(to, tokenId);
        }
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        _requireOwned(tokenId);

        string memory baseURI = _baseURI();
        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json"))
                : "";
    }

    function priceChange(uint256 _price) public onlyOwner {
        price = _price;
    }

    function mintingPrice() public view returns (uint256 mintPrice) {
        return price;
    }
}