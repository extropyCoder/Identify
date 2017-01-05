// testing on testrpc


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
            // the user data is encrypted
            usersdata.addUserData.sendTransaction(accounts[0], "123456", "89", "abcdefg12345", "laurence", "Turl St, Oxford");
            return usersdata.getRegisteredCount.call().then(function(num) {
              return assert.equal(num.valueOf(), 1, "user count incorrect");
            });
        });
    });

    it("adds a user and gets details", function() {
        usersdata = UserData.deployed();
        return usersdata.getRegisteredCount.call().then(function(num) {
            console.log("number of active members is " + num);
            assert.equal(num.valueOf(), 1, "user count incorrect");
            usersdata.addUserData.sendTransaction(accounts[1], "123456", "92", "nihsodu876875", "john", "Broad St, Oxford");
            return usersdata.getUserData.call(accounts[1]).then(function(newdata) {
                //console.log("user data is  " + newdata);
                return assert.equal(newdata[1], 92, "user score incorrect");

            });
        });
    });

    // it("adds a hash of the user details", function() {
    //     usersdata = UserData.deployed();
    //     return usersdata.getRegisteredCount.call().then(function(num) {
    //         console.log("number of active members is " + num);
    //         assert.equal(num.valueOf(), 2, "user count incorrect");
    //         usersdata.addUserData.sendTransaction("0x0aa276db6a32837d7a4663a31665ef111091866a", "123456", "92", "nihsodu876875", "john", "Broad St, Oxford");
    //         return usersdata.getUserData.call("0x0aa276db6a32837d7a4663a31665ef111091866a").then(function(newdata) {
    //             //console.log("user data is  " + newdata);
    //             return assert.equal(newdata[1], 92, "user score incorrect");
    //
    //         });
    //     });
    // });

});
