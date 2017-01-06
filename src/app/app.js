  var defs = require('./defs.json');
  var Web3 = require('web3');
  var CryptoJS = require("crypto-js");
  var lightwallet = require('eth-lightwallet');
  var express = require('express');

  var app = express();
  var bodyParser = require('body-parser')
  app.use( bodyParser.json() );       // to support JSON-encoded bodies
  app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  }));

  var userDataContract;
  var scorerContract;

  // routing
  app.use(express.static('static'));
  app.get('/recogniseFace', recogniseFace);
  app.get('/OCR', OCRText);
  app.get('/geolocate', geolocate);

  app.post('/userData', submitUser);
  app.get('/userScore', getUser);

  app.get('/userAccount', createAccount);

  app.listen(3000, function () {
    console.log('Example app listening on port 3000!');

  });

  connectToChain();

  function getUserScore(req, res){
    // return score for this user
    score = getUserScore(req.body.account);
    return score;

  }

  // this submits the user details onto the blockchain.
  // the fields are encrypted first
  function submitUser(req, res){


    var account = req.body.account;
    var key = req.body.key;
    var score = getUserScore(account);
    var ID = req.body.ID;
    var name = req.body.name;
    var address = req.body.address;
    var datetime = new Date().toLocaleString();


    // first create a hash of the unencrypted values
    // so that we can prove that this score belongs to us
    addHashForUser(account,datetime,score,ID,name,address);

    // now add the encrypted user data to the blockchain
    addUser(encrypt(account.key),encrypt(datetime,key),encrypt(score,key),encrypt(ID,key),encrypt(name,key),encrypt(address,key));


  }
function recogniseFace(req, res){
  // shell to open face to get difference score
}
function OCRText(req, res){
  // process with tessaract to get adddress details etc.
}
function geolocate(req, res){
  // use geolocation in score
}

function createAccount(req, res){
  var password = req.body.password;
  createEthereumAccount(password,handleNewAccount);
}

function handleNewAccount(){
  // new account created
  // need to passback account number to user
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

 var scorerAbi = defs.scorerAbi;
 var scorerAddress = defs.scorerAddress;
 var sC = web3.eth.contract(scorerAbi);
 scorerContract = sC.at(scorerAddress);


 console.log(" user data contract at " + uDataAddress);
 setUpFilter(userDataContract);
 setUpScorerFilter(scorerContract);



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

function setUpScorerFilter(){
    var filter = web3.eth.filter([scorerContract.scoreCalculated]);
    filter.watch(scoreEvent);

}
function scoreEvent (error,result){
 if(!error) {
    console.log("Score Calculated");
     var score =  result.data;
     console.log("Score is " + score );

  } else {
    console.error(new Date() + " " + error);

}
}

  function getUserScore(userAddress){
     var data = userDataContract.getUserData.call(userAddress);
     var score = data[1].toString();
     return score;
  }

function calculateScore(metric1,metric2,metric3,metric4) {
  var Tx = userDataContract.addUserData.sendTransaction(account, datetime,score,IDRef,name, address,{from: web3.eth.accounts[0],gas: 2000000});

}

function addUser(account,datetime,score,IDRef,name,address){
  var Tx = userDataContract.addUserData.sendTransaction(account, datetime,score,IDRef,name, address,{from: web3.eth.accounts[0],gas: 2000000});
}

function addHashForUser(account,datetime,score,IDRef,name,address){
  var hash = SHA256( score + IDRef + name + address);
  var Tx = userDataContract.addHashValues.sendTransaction(account, hash,{from: web3.eth.accounts[0],gas: 2000000});
}
function encrypt (plaintext,key){
  var ciphertext = CryptoJS.AES.encrypt(plaintext, key);
  return ciphertext;
}

function decrypt (ciphertext,key){
  var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), key);
  return bytes;
}

function createEthereumAccount(password,callback){
  var secretSeed = lightwallet.keystore.generateRandomSeed();
  lightwallet.keystore.deriveKeyFromPassword(password, function (err, pwDerivedKey) {

  var ks = new lightwallet.keystore(secretSeed, pwDerivedKey);
  ks.generateNewAddress(pwDerivedKey);
  newAddress = ks.getAddresses();
  var newValues = {seed : secretSeed, address : newAddress};
  callback(newValues);
});
}
