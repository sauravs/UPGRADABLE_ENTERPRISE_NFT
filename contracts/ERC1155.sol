// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

 
        import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
        import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
        import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
        import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155PausableUpgradeable.sol";
        import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
        import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
        import "@openzeppelin/contracts/utils/Strings.sol";


contract AnkitTesting18 is Initializable, ERC1155Upgradeable, OwnableUpgradeable, ERC1155SupplyUpgradeable, ERC1155PausableUpgradeable, UUPSUpgradeable {
        using Strings for uint256;
      uint256 private price;

        
        uint256 private _nextTokenId;    
        string private _name;
        string private _symbol;
        mapping(address => uint) private isVIPlist; // USER WHITELIST WALLET ADDRESS & Number of Token
        uint256 private _maxSupply;
        function initialize() initializer public {
          __ERC1155_init("https://ipfs.io/ipfs/QmZKHp2YTDT217YoLQSnpBVA8o65nkGRSiffcSfnMfPBrT");
          __Ownable_init(msg.sender);
          __ERC1155Pausable_init();
          __ERC1155Supply_init();
          __UUPSUpgradeable_init();
          _name = "AnkitTesting18";
          _symbol = "AnkitTest18";
          _maxSupply= 10000;
          price = 10000000000000000000000;
          _nextTokenId = 1;
        }
        // Function to receive Ether. msg."" must be empty
        receive() external payable {}

        // Fallback function is called when msg."" is not empty
        fallback() external payable {}

        // Pause minting
        function pause() public onlyOwner {
            _pause();
        }
        
        // Unpause minting
        function unpause() public onlyOwner {
            _unpause();
        }
        
        // @dev Name of the token
        function name() public view returns (string memory) {
            return _name;
        }
        
        // @dev Symbol of the token
        function symbol() public view returns (string memory) {
            return _symbol;
        }
        
        function _authorizeUpgrade(address newImplementation) internal onlyOwner override {}
        
        // URI of the token id.
        function uri(uint256 _id) public view override returns (string memory) {
            require(exists(_id), "Non-exists token");
            return
                string(
                    abi.encodePacked(super.uri(_id), Strings.toString(_id), ".json")
                );
        }
        // @dev Balance of token this contracts hold in wei form.
        function contractBalance() public view returns(uint256 fund) {
            return address(this).balance;
        }
        
        // @dev Owner can change price of token in wei
        function priceChange(uint256 _price) public onlyOwner {
            price = _price;
        }

        // @dev To Check minting price in wei
        function mintingPrice() public view returns (uint256 mintPrice) {
            return price;
        }
        // Withdraw the balance from Contract
        function withdraw() external {
            uint256 balance = contractBalance();
            require(balance > 0, "Insufficent funds");
            payable(0x911783781755C7A8cE91898C6E19ee057ba94dB6).transfer(balance);
        }
        // The following functions are overrides required by Solidity.
        function _update(address from, address to, uint256[] memory ids, uint256[] memory values) internal override(ERC1155Upgradeable, ERC1155SupplyUpgradeable, ERC1155PausableUpgradeable) {
            super._update(from, to, ids, values);
        }
        // @dev Add wallet address of VIPList
        function addVIPList(address[] memory _users, uint256 _allowTokens) public onlyOwner {
            for (uint i = 0; i < _users.length; i++) {
                isVIPlist[_users[i]] = _allowTokens;
            }
        }

        // Owner added wallet address allowed to mint the NFT.
        function mintVIPList(uint256 _tokenId, uint256 amount) public payable {
            require(amount > 0 && amount <= 20,"Wrong Limit!");
            require(msg.value == price * (amount), "Insufficient funds");
            require(bytes(uri(_tokenId)).length > 0,"URI not Found!");
            require(amount <= isVIPlist[msg.sender], "Insufficient Token");
            _mint(msg.sender, _tokenId, amount, "");
            isVIPlist[msg.sender] -= amount;
        }

        // @dev Check how many NFT left with the walletAddress
        function checkVIP(address walletAddress) public view returns(uint256) {
            uint256 numberOfTokenLeft = isVIPlist[walletAddress];
            return numberOfTokenLeft;
        }
        // @dev User can mint the token with multiple amount to the wallet address 
        function mint(address account, uint256 tokenId, uint256 amount) public whenNotPaused payable {
            require(msg.value == price*amount, "Insufficient funds");
            require(tokenId >= _nextTokenId && tokenId <= _nextTokenId+_maxSupply-1,"Limited limit");
            _mint(account, tokenId, amount, "");
            payable(address(this)).transfer(msg.value);
        }
        // @dev Owner mint token with multiple amount to a wallet address
        function ownerMint(address account, uint256 tokenId,  uint256 amount) public onlyOwner {
            require(tokenId >= _nextTokenId && tokenId <= _nextTokenId+_maxSupply-1,"Limited limit");
            _mint(account, tokenId, amount, "");
        }

        // @dev Owner mint multiple ids with multiple amounts to a Wallet address.
        function ownerMintBatch(address to, uint256[] memory ids, uint256[] memory amounts) public onlyOwner {
            require(totalSupply()+ids.length <= _maxSupply,"Max Limit Reached");
            require(ids.length <= 20,"Max Limit Reached");
            require(ids.length == amounts.length,"Length should match");
            _mintBatch(to, ids, amounts, "");
        }
}