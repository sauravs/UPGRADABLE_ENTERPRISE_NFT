// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

 
    import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
    import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721PausableUpgradeable.sol";
    import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
    import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
    import "@openzeppelin/contracts/utils/Strings.sol";

contract ERC721Test1 is ERC721EnumerableUpgradeable, ERC721PausableUpgradeable, OwnableUpgradeable, UUPSUpgradeable {
 
    using Strings for uint256;
    string private _baseURIextended;               
          
 
       mapping(address => uint) public isVIPlist;        // stores the number of tokens an address on the VIP list minted so far.
       
       uint256 private price; 

       uint256 private _nextTokenId; 



      function initialize() public initializer {
        __ERC721_init("AnkitTesting16", "AnkitTest16");
        __ERC721Enumerable_init();
        __ERC721Pausable_init();
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        _baseURIextended = "https://ipfs.io/ipfs/QmZKHp2YTDT217YoLQSnpBVA8o65nkGRSiffcSfnMfPBrT";
        _nextTokenId = 1;
        price = 0;
    }
    
    /// @notice A special function that allows the contract to receive Ether when no data is sent.
    receive() external payable {}

    /// @notice A fallback function that is called when the contract receives Ether along with data.
    fallback() external payable {}

    
    /// @notice Returns the balance of Ether/Matic (native token of blockchain) in the contract.
    function contractBalance() public view returns(uint256 fund) {
        return address(this).balance;
    }
   
    /// @notice Allows the contract owner to change the price of minting a token.
    /// @param _price The new price for minting a token.
    function priceChange(uint256 _price) public onlyOwner {
        price = _price;
    }


    /// @notice Returns the current price of minting a token.


    function mintingPrice() public view returns (uint256 mintPrice) {
        return price;
    }

    /// @notice Allows the contract owner to pause all token transfers.


    function pause() public onlyOwner {
        _pause();
    }

    /// @notice Allows the contract owner to unpause all token transfers.


    function unpause() public onlyOwner {
        _unpause();
    }


    /// @notice Allows to withdraw all Ether from the contract to a specific address.
    function withdraw() external {
        uint256 balance = contractBalance();
        require(balance > 0, "Insufficent funds");
        payable(0x911783781755C7A8cE91898C6E19ee057ba94dB6).transfer(balance);
    }

    
    /// @notice Returns the base URI for the token metadata.

    function _baseURI() internal view override returns (string memory) {
        return _baseURIextended;
    }
      
      
    /// @notice Allows the contract owner to change the base URI for the token metadata.
    /// @param baseURI The new base URI for the token metadata.

    function _setBaseURI(string memory baseURI) public onlyOwner {
        _baseURIextended = baseURI;
    }
    
    
    /// @notice Increases the balance of a specific account.
    /// @param account The account whose balance will be increased.
    /// @param value The amount by which the balance will be increased.
    function _increaseBalance(address account, uint128 value) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {
        super._increaseBalance(account, value);
    }

    
    /// @notice Checks if the contract supports a specific interface.
    /// @param interfaceId The ID of the interface to check for support.
      
    function supportsInterface(bytes4 interfaceId) public view override(ERC721Upgradeable, ERC721EnumerableUpgradeable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }


   /// @notice Allows the contract owner to authorize a contract upgrade.
    /// @param newImplementation The address of the new contract implementation.
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
          


    /// @notice Returns the URI for a specific token's metadata.
    /// @param tokenId The ID of the token to return the URI for.   

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
            _requireOwned(tokenId);

            string memory baseURI = _baseURI();
            return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString(),".json")) : "";
          }
    
    
    /// @notice Allows anyone to mint a token to a specific address if they send enough Ether/Matic.
    /// @param to The address to mint the token to.
    
    function safeMint(address to) public payable whenNotPaused {
        require(msg.value >= price, "Insufficient funds");
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        payable(address(this)).transfer(msg.value);
    }

    
    /// @notice Allows the contract owner to mint a specific number of tokens to a specific address.
    /// @param to The address to mint the tokens to.
    /// @param _mintNumber The number of tokens to mint.
    function ownerMint(address to, uint256 _mintNumber) public onlyOwner {
    require(_mintNumber > 0 && _mintNumber <= 20,"Wrong Limit!");
        for (uint256 i = 0; i < _mintNumber; i++) {
            uint256 tokenId = _nextTokenId++;
            _safeMint(to, tokenId);
        }
    }


    /// @notice Updates the owner of a specific token.
    /// @param to The new owner of the token.
    /// @param tokenId The ID of the token to update the owner of.
    /// @param auth The address authorized to update the owner.

    function _update(address to, uint256 tokenId, address auth) override(ERC721EnumerableUpgradeable, ERC721PausableUpgradeable) internal returns(address)  {
        return super._update(to, tokenId, auth);
    }



    /// @notice Allows the contract owner to add addresses to a VIP list and set the number of tokens they are allowed to mint.
    /// @param _users The addresses to add to the VIP list.
    /// @param _allowTokens The number of tokens each address is allowed to mint.


    function addVIPList(address[] memory _users, uint256 _allowTokens) public onlyOwner {
        for (uint i = 0; i < _users.length; i++) {
            isVIPlist[_users[i]] = _allowTokens;
        }
    }




    /// @notice Allows an address on the VIP list to mint a specific number of tokens.
    /// @param numberOfTokens The number of tokens to mint.


    function VIPList(uint256 numberOfTokens) public payable {
        require(numberOfTokens > 0 && numberOfTokens <= 20,"Wrong Limit!");
        require(msg.value >= price * (numberOfTokens), "Insufficient funds");  // @audit what if users by mistake send much more price amount?
        require(numberOfTokens <= isVIPlist[msg.sender]  , "Insufficient Token"); // @audit should be less than equal to..updated by auditor
        for(uint i = 0; i < numberOfTokens ; i++) {                               
            uint256 newItemId = _nextTokenId++;
            _safeMint(msg.sender, newItemId);

        } 
        isVIPlist[msg.sender] -= numberOfTokens;
    }


    /// @notice Returns the number of tokens an address on the VIP list is allowed to mint.
    /// @param walletAddress The address to check the number of tokens for.


    function checkVIP(address walletAddress) public view returns(uint256) {    //@audit redundant function if is VIP list is public   
    //@audit or checkVIP should be to check if the address is in VIP list or not by returning bool value
    
        uint256 numberOfTokenLeft = isVIPlist[walletAddress];
        return numberOfTokenLeft;
    }
}


/**
initialize(): Initializes the contract with the name "AnkitTesting16", symbol "AnkitTest16", sets the base URI for the token metadata, sets the initial token ID to 1, and sets the initial price to 0.

receive(): A special function that allows the contract to receive Ether.

fallback(): A fallback function that is called when the contract receives Ether along with data.

contractBalance(): Returns the balance of Ether in the contract.

priceChange(uint256 _price): Allows the contract owner to change the price of minting a token.

mintingPrice(): Returns the current price of minting a token.

pause(): Allows the contract owner to pause all token transfers.

unpause(): Allows the contract owner to unpause all token transfers.

withdraw(): Allows to withdraw all Ether from the contract to a specific address.

_baseURI(): Returns the base URI for the token metadata.

_setBaseURI(string memory baseURI): Allows the contract owner to change the base URI for the token metadata.

_increaseBalance(address account, uint128 value): Increases the balance of a specific account.

supportsInterface(bytes4 interfaceId): Checks if the contract supports a specific interface.

_authorizeUpgrade(address newImplementation): Allows the contract owner to authorize a contract upgrade.

tokenURI(uint256 tokenId): Returns the URI for a specific token's metadata.

safeMint(address to): Allows anyone to mint a token to a specific address if they send enough Ether.

ownerMint(address to, uint256 _mintNumber): Allows the contract owner to mint a specific number of tokens to a specific address.

_update(address to, uint256 tokenId, address auth): Updates the owner of a specific token.

addVIPList(address[] memory _users, uint256 _allowTokens): Allows the contract owner to add addresses to a VIP list and set the number of tokens they are allowed to mint.

VIPList(uint256 numberOfTokens): Allows an address on the VIP list to mint a specific number of tokens.

checkVIP(address walletAddress): Returns the number of tokens an address on the VIP list is allowed to mint.
 */