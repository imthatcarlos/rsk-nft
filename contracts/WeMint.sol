// SPDX-License-Identifier: MIT
pragma solidity ^ 0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WeMint is ERC721URIStorage, ERC721Enumerable, AccessControlEnumerable, Ownable, IERC2981 {
  using Counters for Counters.Counter;
  using Strings for uint256;

  Counters.Counter private _tokenIdTracker;

  bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

  struct Royalty {
    address receiver;
    uint256 percent;
  }

  mapping(uint256 => Royalty) private perTokenRoyalty;

  constructor(string memory name, string memory ticker) ERC721(name, ticker) {
    _setupRole(MINTER_ROLE, _msgSender());
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal virtual override(ERC721, ERC721Enumerable) {
    ERC721Enumerable._beforeTokenTransfer(from, to, tokenId);
  }

  function _burn(uint256 tokenId) internal virtual override(ERC721URIStorage, ERC721) {
    ERC721URIStorage._burn(tokenId);
  }

  function tokenURI(uint256 tokenId) public view virtual override(ERC721URIStorage, ERC721) returns(string memory) {
    return ERC721URIStorage.tokenURI(tokenId);
  }

  function mint(address to, string memory URI, address royaltyRecipient, uint256 royaltyValue) public virtual {
    require(hasRole(MINTER_ROLE, _msgSender()), "WeMintArt: must have minter role to mint");
    require(royaltyValue <= 1000 && royaltyValue >= 0, 'WeMintArt: invalid royalty amount');
    require(royaltyRecipient != address(0), 'WeMintArt: invalid royalty amount');

    _mint(to, _tokenIdTracker.current());
    _setTokenURI(_tokenIdTracker.current(), URI);
    perTokenRoyalty[_tokenIdTracker.current()] = Royalty(royaltyRecipient, royaltyValue);

    _tokenIdTracker.increment();
  }

  function royaltyInfo(
    uint256 _tokenId,
    uint256 _salePrice
  ) external view override returns(address receiver, uint256 royaltyAmount) {
    Royalty memory royalty = perTokenRoyalty[_tokenId];
    return (royalty.receiver, (_salePrice * royalty.percent) / 1000);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControlEnumerable, ERC721Enumerable, IERC165) returns(bool) {
    return interfaceId == _INTERFACE_ID_ERC2981 || ERC721.supportsInterface(interfaceId) || ERC721Enumerable.supportsInterface(interfaceId);
  }
}
