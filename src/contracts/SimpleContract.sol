pragma solidity ^0.4.2;
contract Owned  {
  address public owner;
  modifier onlyOwner() {
    if (msg.sender==owner) _;
  }
  function Owned() {
    owner = msg.sender;
  }
  function changeOwner(address newOwner) onlyOwner {
    owner = newOwner;
  }

}

contract Mortal is Owned {
  function kill() onlyOwner {
    suicide(owner);
  }
// as a default don't want ether
    function() {
          throw;
    }
}

contract Active is Owned{
  bool public active;

  modifier isActive(){if (active==true || msg.sender==owner) _;}

  function setActive(bool _active) onlyOwner {
    active = _active;
  }

}


contract NameRegistry is Owned,Mortal{

  mapping (string=>address) registry;

  function NameRegistry(){
  }

  function addMapping(string _name,address _address) external onlyOwner {
        registry[_name]=_address;
  }

  function getMapping(string _name) external constant returns (address){
        return registry[_name];
  }


}


contract SimpleContract is Mortal,Active{
    NameRegistry registry;
    string public contractName;

    function SimpleContract(NameRegistry _registry, string _contractName){
        registry = _registry;
        contractName = _contractName;
        active = true;

    }

}
