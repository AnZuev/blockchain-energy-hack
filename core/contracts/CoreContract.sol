pragma solidity ^0.4.0;

contract CoreContract {

    struct Peer {
        string typeOfUser;
        uint balance;
        uint usualConsumption; // TODO: change to mapping
    }

    // 5-minute slot
    struct Slot {
        address user;
        uint consumption;
    }

    // storing consumption promise of a user
    struct ConsPromise {
        address promisingUser;
        uint promisedPower;
    }

    struct Offer {
        address initiator;
        uint neededPower;
        uint rewardPerKw;
        uint startTime;
        uint endTime;
    }

    mapping (address => Peer) public users;
    mapping (uint => Slot[]) public consumptionDB; // uint = timestamp

    // for both following mappings keys are offer ids
    mapping (uint => Offer) public offers;
    mapping (uint => ConsPromise[]) public consumptionPromises;
    uint public numberOfOffers; // to track offer ids

    address private observer; // to listen for new offers


    function checkUserCons(address user, uint offerId) public returns(bool) {
        uint startTime = offers[offerId].startTime;
        uint endTime = offers[offerId].endTime;
        uint promisedReduct = getPromisedPower(offerId, user);
        uint usualCons = getUserUsualCons(user);
        for (startTime; startTime < endTime; startTime++) {
            uint actual = getConsumptionPerUser(startTime, user);
            if (actual <= (usualCons - promisedReduct)) continue;
            else {
                return false;
            }
        }
        return true;
    }

    function payToUser(address user, uint offerId) public {
        bool result = checkUserCons(user, offerId);
        if (result) {
            uint reward = offers[offerId].rewardPerKw;
            uint givenPower = getPromisedPower(offerId, user);
            users[user].balance += (reward * givenPower);
        }
    }

    function addNewOffer(address initiator, uint power, uint reward, uint startTime, uint endTime) public returns(uint){
        if (getUserBalance(initiator) < reward * power) return 0;
        else {
            numberOfOffers += 1;
            users[initiator].balance = getUserBalance(initiator) - (reward * power);
            offers[numberOfOffers] = Offer({initiator: initiator, neededPower: power, rewardPerKw: reward, startTime: startTime, endTime: endTime});
            return numberOfOffers;
        }
    }

    // returns array of offer ids
    function getAvailableOffers(uint currentTime) public returns(uint[]){
        uint[] availableOffers;
        for (uint i = 0; i <= numberOfOffers; i++) {
            if (offers[i].startTime > currentTime) {
                availableOffers.push(i);
            }
        }
        return availableOffers;
    }

    function respondToOffer(uint id, address user, uint power) public {
        consumptionPromises[id].push(ConsPromise({promisingUser: user, promisedPower: power}));
    }

    // promise getters

    function getPromisingUsers(uint id) public returns(address[]) {
        address[] promisingUsers;
        for (uint i = 0; i < consumptionPromises[id].length; i++) {
            promisingUsers.push(consumptionPromises[id][i].promisingUser);
        }
        return promisingUsers;
    }

    function getPromisedPower(uint id, address user) public returns(uint) {
        ConsPromise[] promises = consumptionPromises[id];
        for (uint i = 0; i < promises.length; i++) {
            if (promises[i].promisingUser == user) return promises[i].promisedPower;
        }
        return 0;
    }

    function getCurrentlyPromisedPower(uint id) public returns(uint) {
        uint sumPromises;
        ConsPromise[] promises = consumptionPromises[id];
        for (uint i = 0; i < promises.length; i++) {
            sumPromises += promises[i].promisedPower;
        }
        return sumPromises;
    }


    // offer getters
    function getNumOffers() public returns(uint) {
        return numberOfOffers;
    }

    function getOfferAuthor(uint id) public returns(address) {
        return offers[id].initiator;
    }

    function getOfferPower(uint id) public returns(uint) {
        return offers[id].neededPower;
    }

    function getOfferReward(uint id) public returns(uint) {
        return offers[id].rewardPerKw;
    }

    function getOfferStart(uint id) public returns(uint) {
        return offers[id].startTime;
    }

    function getOfferEnd(uint id) public returns(uint) {
        return offers[id].endTime;
    }

    function getOfferInfo(uint id) public returns (address, uint, uint, uint, uint) {
        return (offers[id].initiator, offers[id].neededPower, offers[id].rewardPerKw, offers[id].startTime, offers[id].endTime);
    }


    function setObserver(address obs) private {
        observer = obs;
    }


    function getCurrentOverallConsumption(uint currentTime) returns(uint) {
        Slot[] slots = consumptionDB[currentTime];
        uint overallConsumption;
        for (uint i = 0; i < slots.length;i++) {
            overallConsumption += slots[i].consumption;
        }
        return overallConsumption;
    }


    function addNewUser(address userAddress, string typeOfUser, uint balance, uint consumption) public {
        users[userAddress] = Peer({typeOfUser: typeOfUser, balance: balance, usualConsumption: consumption});
    }

    function addNewSlot(address userAddress, uint consumption, uint currentTime) public {
        consumptionDB[currentTime].push(Slot(userAddress, consumption));
    }

    function getUserBalance(address adr) public returns(uint) {
        return users[adr].balance;
    }

    function getUserUsualCons(address adr) public returns(uint) {
        return users[adr].usualConsumption;
    }

    function getConsumptionPerUser(uint timestamp, address userAdr) public returns(uint) {
        Slot[] slotsPerTime = consumptionDB[timestamp];
        for (uint i = 0; i < slotsPerTime.length; i++) {
            if (slotsPerTime[i].user == userAdr) return slotsPerTime[i].consumption;
        }
    }




}
