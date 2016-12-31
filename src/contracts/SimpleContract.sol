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
    bool public active;
    modifier checkState(bool state){if (active==state) _;}
    function setActive() onlyOwner{
      active=true;

  }
    function setInactive() onlyOwner{
      active=false;

  }
    function kill() onlyOwner {
        suicide(owner);
  }
// as a default don't want ether
    function() {
          throw;
    }
}



contract NameRegistry is Owned,Mortal{

  mapping (string=>address) registry;
  event MappingAdded(string);
  event OwnerDone(address);
  function NameRegistry(){
      setActive();
  }

  function addMapping(string _name,address _address) external  checkState(true) {
      OwnerDone(msg.sender);
        registry[_name]=_address;
        MappingAdded(_name);
  }

  function getMapping(string _name) checkState(true) external constant returns (address){
        return registry[_name];
  }


}


contract SimpleContract is Mortal{
    string public contractName;

    function SimpleContract(string _contractName){
        contractName = _contractName;
    }


}
