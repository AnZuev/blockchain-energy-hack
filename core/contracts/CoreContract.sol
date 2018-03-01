pragma solidity ^0.4.0;

contract CoreContract {

    struct Peer {
        string typeOfUser;
        uint balance;
        mapping (uint => uint) usualConsumption; // timestamp => consumption
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

    mapping (uint => address) public secretNumbersTG;

    mapping (address => Peer) public users;
    mapping (uint => Slot[]) public consumptionDB; // uint = timestamp

    // for both following mappings keys are offer ids
    mapping (uint => Offer) public offers;
    mapping (uint => ConsPromise[]) public consumptionPromises;
    uint public numberOfOffers; // to track offer ids

    address private observer; // to listen for new offers

    // for telegram shit (by Sonya)
    function addNewSecretNum(uint number, address adr) public {
        secretNumbersTG[number] = adr;
    }

    //for telegram shit (by Sonya)
    function getAddress(uint number) public view returns(address){
        return secretNumbersTG[number];
    }

    // check user consumption
    function checkUserCons(address user, uint offerId) public returns(bool) {
        uint startTime = offers[offerId].startTime;
        uint endTime = offers[offerId].endTime;
        uint promisedReduct = getPromisedPower(offerId, user);
        for (startTime; startTime < endTime; startTime++) {
            uint usualCons = getUserUsualCons(user, startTime);
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
    function getAvailableOffers(uint currentTime) public view returns(uint[]){
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

    function getPromisingUsers(uint id) public view returns(address[]) {
        address[] promisingUsers;
        for (uint i = 0; i < consumptionPromises[id].length; i++) {
            promisingUsers.push(consumptionPromises[id][i].promisingUser);
        }
        return promisingUsers;
    }

    function getNumPromisingUsers(uint id) public view returns(uint) {
        return consumptionPromises[id].length;
    }

    function getPromisedPower(uint id, address user) public view returns(uint) {
        ConsPromise[] promises = consumptionPromises[id];
        for (uint i = 0; i < promises.length; i++) {
            if (promises[i].promisingUser == user) return promises[i].promisedPower;
        }
        return 0;
    }

    function getCurrentlyPromisedPower(uint id) public view returns(uint) {
        uint sumPromises;
        ConsPromise[] promises = consumptionPromises[id];
        for (uint i = 0; i < promises.length; i++) {
            sumPromises += promises[i].promisedPower;
        }
        return sumPromises;
    }


    // offer getters
    function getNumOffers() public view returns(uint) {
        return numberOfOffers;
    }

    function getOfferAuthor(uint id) public view returns(address) {
        return offers[id].initiator;
    }

    function getOfferPower(uint id) public view returns(uint) {
        return offers[id].neededPower;
    }

    function getOfferReward(uint id) public view returns(uint) {
        return offers[id].rewardPerKw;
    }

    function getOfferStart(uint id) public view returns(uint) {
        return offers[id].startTime;
    }

    function getOfferEnd(uint id) public view returns(uint) {
        return offers[id].endTime;
    }

    function getOfferInfo(uint id) public view returns (address, uint, uint, uint, uint) {
        return (offers[id].initiator, offers[id].neededPower, offers[id].rewardPerKw, offers[id].startTime, offers[id].endTime);
    }


    function setObserver(address obs) private {
        observer = obs;
    }


    function getCurrentOverallConsumption(uint currentTime) view returns(uint) {
        Slot[] slots = consumptionDB[currentTime];
        uint overallConsumption;
        for (uint i = 0; i < slots.length;i++) {
            overallConsumption += slots[i].consumption;
        }
        return overallConsumption;
    }



    function checkUserExistence() public view returns(bool){
        Peer user = users[msg.sender];
        return (keccak256(user.typeOfUser) == keccak256(""));
    }

    // usual consumption is an array with all timestamps for the day (24 hours) with typical consumption of user
    function addNewUser(address userAddress, string typeOfUser, uint balance, uint[] usualConsumption) public {
        users[userAddress] = Peer({typeOfUser: typeOfUser, balance: balance});
        for (uint i = 0; i < usualConsumption.length; i++) {
            users[userAddress].usualConsumption[i] = usualConsumption[i];
        }
    }

    function addNewSlot(address userAddress, uint consumption, uint currentTime) public {
        consumptionDB[currentTime].push(Slot(userAddress, consumption));
    }

    function getUserBalance(address adr) public view returns(uint) {
        return users[adr].balance;
    }

    function getUserUsualCons(address adr, uint timestamp) public view returns(uint) {
        return users[adr].usualConsumption[timestamp];
    }

    function getConsumptionPerUser(uint timestamp, address userAdr) public view returns(uint) {
        Slot[] slotsPerTime = consumptionDB[timestamp];
        for (uint i = 0; i < slotsPerTime.length; i++) {
            if (slotsPerTime[i].user == userAdr) return slotsPerTime[i].consumption;
        }
    }


}
