//U2FsdGVkX1+443F+umaUnfFhtzFJxwJouL2iR1Q54OoZF2Q6BnlChGOtnGu32Tjc

//address _accountNumber,
//int256 _datetime,
//int _score,
//bytes32 _IDRef,
//bytes32 _name,
//bytes32 _userAddress


contract('UserData', function(accounts) {
    it("tests set up", function() {
        usersdata = UserData.deployed();
        console.log("user data deployed ");
    });

    it("checks number of registered users", function() {
        usersdata = UserData.deployed();
        return usersdata.getRegisteredCount.call().then(function(num) {
            console.log("number of active members is " + num);
            assert.equal(num.valueOf(), 0, "user count incorrect");
        });
    });

    it("adds a user", function() {
        usersdata = UserData.deployed();
        return usersdata.getRegisteredCount.call().then(function(num) {
            console.log("number of active members is " + num);
            assert.equal(num.valueOf(), 0, "user count incorrect");
            usersdata.addUserData.sendTransaction("0x0f5adee83cfd79ea1dc8e771212dc77329f8d79c", "123456", "89", "abcdefg12345", "laurence", "Turl St, Oxford");
            return usersdata.getRegisteredCount.call().then(function(num) {
                console.log("number of users is now " + num);
                return assert.equal(num.valueOf(), 1, "user count incorrect");
            });
        });
    });



});
