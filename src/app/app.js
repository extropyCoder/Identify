  var defs = require('./defs.json');
  var Web3 = require('web3');
  var CryptoJS = require("crypto-js");
  var express = require('express');

  var app = express();

  var userDataContract;


  app.use(express.static('static'));
  app.post('/userData', userFunction);
  app.get('/userData', userFunction);

  app.listen(3000, function () {
    console.log('Example app listening on port 3000!');

  });

  function userFunction(req, res){
    console.log(' in user function');
    connectToChain();
    score = getUserScore();
    return score;

  }

function connectToChain(){
  if (typeof web3 !== 'undefined') {
      web3 = new Web3(web3.currentProvider);
  } else {
      web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  var accounts;
  var account;

web3.eth.getAccounts(function(err, accs) {
  if (err != null) {
    console.log("There was an error fetching your accounts.");
    return;
  }

  if (accs.length == 0) {
    console.log("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
    return;
  }

  accounts = accs;
  account = accounts[0];
});


 // now set up contract definitions
 var uDataAbi = defs.userDataAbi;
 var uDataAddress = defs.userDataAddress;
 var uC = web3.eth.contract(uDataAbi);
 userDataContract = uC.at(uDataAddress);

 console.log("contract at " + uDataAddress);
 setUpFilter(userDataContract);

}


  function setUpFilter(){
      var filter = web3.eth.filter([userDataContract.userAdded]);
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

function getOwner(){
  var data = userDataContract.owner.call();
  console.log("Owner is " + (data.toString()));
}

  function getUserScore(userAddress){
     var data = userDataContract.getUserData.call(userAddress);
     var score = data[1].toString();
     console.log("Score is " + score);
     return score;
  }


function addUser(account,datetime,score,IDRef,name,address){
  var Tx = userDataContract.addUserData.sendTransaction(account, datetime,score,IDRef,name, address,{from: web3.eth.accounts[0],gas: 2000000});
}


function encrypt (plaintext,key){
  var ciphertext = CryptoJS.AES.encrypt(plaintext, key);
  return ciphertext;
}

function decrypt (ciphertext,key){
  var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), key);
  return bytes;
}
