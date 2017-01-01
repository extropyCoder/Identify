  var defs = require('./defs.json');
  var Web3 = require('web3');
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    var accounts;
    var account;

  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      alert("There was an error fetching your accounts.");
      return;
    }

    if (accs.length == 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }

    accounts = accs;
    account = accounts[0];
  });


   // now set up contract definitions
   var uDataAbi = defs.userDataAbi;
   var uDataAddress = defs.userDataAddress;
   var uC = web3.eth.contract(uDataAbi);
   var userDataContract = uC.at(uDataAddress);

   console.log("contract at " + uDataAddress);
  //  var data = userDataContract.owner.call();
  //  console.log((data));
   setUpFilter(userDataContract);
   getOwner(userDataContract);
   addUser(userDataContract);

   //getUserScore(userDataContract,"0x6da8a7f1484de907c4198ba6ed6880e88b834e2f")

  function setUpFilter(contract){
      var filter = web3.eth.filter([contract.userAdded]);
      filter.watch(dataEvent);

  }

  function dataEvent (error,result){
   if(!error) {
      console.log("User Added");
       var userAccount = '0x' + result.data.slice(26,66);
       console.log("New User is " + userAccount );

    } else {
      console.error(new Date() + " " + error);

  }
}

function getOwner(contract){
  var data = contract.owner.call();
  console.log("Owner is " + (data.toString()));
}

  function getUserScore(contract,userAddress){
     var data = contract.getUserData.call(userAddress);
     console.log("Score is " + (data[1].toString()));

  }


function addUser(contract){

  var Tx = contract.addUserData.sendTransaction("0x6da8a7f1484de907c4198ba6ed6880e88b834e2f", "123456", "89", "abcdefg12345", "laurence", "Turl St, Oxford",{from: web3.eth.accounts[0],gas: 2000000});

}
