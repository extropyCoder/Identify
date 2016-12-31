pragma solidity ^0.4.2;
import "SimpleContract.sol";
contract UserData is SimpleContract("UserData"){

    struct Data {
        int256 datetime;
        int score;
        bytes32 IDRef;
        bytes32 name;
        bytes32 userAddress;

    }

    address [] private registeredAccounts;
    mapping (address=>Data) userData;
    mapping(address=>bytes32) hashedValues;

    modifier accountIsValid(address _account){
        if(_account!=0x0) _;
    }

    modifier userRegistration(address _accountNumber, bool expectedValue){
        if(userIsRegistered(_accountNumber)==expectedValue) _;
    }


    function UserData(){

    }

    function addUserData(
        address _accountNumber,
        int256 _datetime,
        int _score,
        bytes32 _IDRef,
        bytes32 _name,
        bytes32 _userAddress
        ) external onlyOwner accountIsValid(_accountNumber) {

        userData[_accountNumber] =
            Data({datetime :_datetime,score:_score,IDRef:_IDRef,name :_name,userAddress: _userAddress});
    }

    function getUserData(address _acccountNumber) userRegistration(_acccountNumber, true) external constant returns (int256,int,bytes32,bytes32,bytes32) {

            Data thisUser = userData[_acccountNumber];
            return (thisUser.datetime,thisUser.score,thisUser.IDRef,thisUser.name,thisUser.userAddress);
    }

    function userIsRegistered(address _acccountNumber) constant returns (bool){
        for (uint16 ii=0;ii<registeredAccounts.length;ii++){
         if(registeredAccounts[ii] == _acccountNumber){
           return true;
         }
     }
     return false;
    }



    function getHashValues(address _accountNumber) constant external returns (bytes32){
        return hashedValues[_accountNumber];
    }



}
