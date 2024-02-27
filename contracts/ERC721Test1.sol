// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

 
    import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
    import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721PausableUpgradeable.sol";
    import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
    import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
    import "@openzeppelin/contracts/utils/Strings.sol";

contract AnkitTesting16 is ERC721EnumerableUpgradeable, ERC721PausableUpgradeable, OwnableUpgradeable, UUPSUpgradeable {
 
    using Strings for uint256;
    string private _baseURIextended;
          
 
       mapping(address => uint) public isVIPlist; // USER WHITELIST WALLET ADDRESS & Number of Token
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
    
    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

    function contractBalance() public view returns(uint256 fund) {
        return address(this).balance;
    }

    function priceChange(uint256 _price) public onlyOwner {
        price = _price;
    }

    function mintingPrice() public view returns (uint256 mintPrice) {
        return price;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
      // Withdraw the balance from Contract
    function withdraw() external {
        uint256 balance = contractBalance();
        require(balance > 0, "Insufficent funds");
        payable(0x911783781755C7A8cE91898C6E19ee057ba94dB6).transfer(balance);
    }
    function _baseURI() internal view override returns (string memory) {
        return _baseURIextended;
    }
      
    function _setBaseURI(string memory baseURI) public onlyOwner {
        _baseURIextended = baseURI;
    }
      
    function _increaseBalance(address account, uint128 value) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {
        super._increaseBalance(account, value);
    }
      
    function supportsInterface(bytes4 interfaceId) public view override(ERC721Upgradeable, ERC721EnumerableUpgradeable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
          
          function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
            _requireOwned(tokenId);

            string memory baseURI = _baseURI();
            return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString(),".json")) : "";
          }
    function safeMint(address to) public payable whenNotPaused {
        require(msg.value >= price, "Insufficient funds");
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        payable(address(this)).transfer(msg.value);
    }
    function ownerMint(address to, uint256 _mintNumber) public onlyOwner {
    require(_mintNumber > 0 && _mintNumber <= 20,"Wrong Limit!");
        for (uint256 i = 0; i < _mintNumber; i++) {
            uint256 tokenId = _nextTokenId++;
            _safeMint(to, tokenId);
        }
    }
    // The following functions are overrides required by Solidity.
    function _update(address to, uint256 tokenId, address auth) override(ERC721EnumerableUpgradeable, ERC721PausableUpgradeable) internal returns(address)  {
        return super._update(to, tokenId, auth);
    }
    // @dev Add wallet address of VIPList
    function addVIPList(address[] memory _users, uint256 _allowTokens) public onlyOwner {
        for (uint i = 0; i < _users.length; i++) {
            isVIPlist[_users[i]] = _allowTokens;
        }
    }

    // @dev Only wallet addres added in addVIPList added able to mint
    function VIPList(uint256 numberOfTokens) public payable {
        require(numberOfTokens > 0 && numberOfTokens <= 20,"Wrong Limit!");
        require(msg.value >= price * (numberOfTokens), "Insufficient funds");
        require(numberOfTokens >= isVIPlist[msg.sender], "Insufficient Token");
        for(uint i = 0; i < numberOfTokens; i++) {
            uint256 newItemId = _nextTokenId++;
            _safeMint(msg.sender, newItemId);

        }
        isVIPlist[msg.sender] -= numberOfTokens;
    }

    // @dev Check how many NFT left with the walletAddress
    function checkVIP(address walletAddress) public view returns(uint256) {
        uint256 numberOfTokenLeft = isVIPlist[walletAddress];
        return numberOfTokenLeft;
    }
}