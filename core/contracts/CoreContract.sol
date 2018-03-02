pragma solidity ^0.4.19;

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
        uint reward;
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

    // to map users to all the offers (ids) they've agreed to
    mapping (address => uint[]) public userOffers;


    address public observer; // to listen for new offers
    address public owner; //just in case
    uint256 time;


    function CoreContract() public{
        owner = msg.sender;
        time = 25;
    }


    function getOwner() public view returns(address){
        return owner;
    }

    function setObserver(address obs) public{
        require(msg.sender == owner);
        observer = obs;
    }

    function updateTime(uint256 nextTime) public returns (uint256){
        //require(msg.sender == observer);
        time = nextTime;
        return time;
    }

    function getTime() public view returns (uint256){
        return time;
    }

    // for telegram shit (by Sonya)
    function addNewSecretNum(uint number, address adr) public {
        secretNumbersTG[number] = adr;
    }

    //for telegram shit (by Sonya)
    function getAddress(uint number) public view returns(address){
        return secretNumbersTG[number];
    }

    //for telegram shit (by Sonya)
    function checkIsUserHasConnected(uint number) public returns(bool) {
        if (secretNumbersTG[number] != 0x0000000000000000000000000000000000000000) {
            return true;
        }
        else {
            return false;
        }
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
            uint reward = offers[offerId].reward;
            uint givenPower = getPromisedPower(offerId, user);
            users[user].balance += (reward * givenPower);
        }
    }

    function addNewOffer(uint power, uint reward, uint startTime, uint endTime) public returns(uint){
        address initiator = msg.sender;
        if (getUserBalance(initiator) < reward) return 0;
        else {
            numberOfOffers += 1;
            users[initiator].balance = getUserBalance(initiator) - (reward);
            offers[numberOfOffers] = Offer({initiator: initiator, neededPower: power, reward: reward, startTime: startTime, endTime: endTime});
            return numberOfOffers;
        }
    }

    // returns array of offer ids
    // pass currentTime=0 to get all future offers
    function getAvailableOffers(uint currentTime) public view returns(uint[]){
        if (currentTime == 0){
            currentTime = time + 1;
        }

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
        userOffers[user].push(id);
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

    // for one user for one particular offer
    function getPromisedPower(uint id, address user) public view returns(uint) {
        ConsPromise[] promises = consumptionPromises[id];
        for (uint i = 0; i < promises.length; i++) {
            if (promises[i].promisingUser == user) return promises[i].promisedPower;
        }
        return 0;
    }

    // total for one offer
    function getCurrentlyPromisedPower(uint id) public view returns(uint) {
        uint sumPromises;
        ConsPromise[] promises = consumptionPromises[id];
        for (uint i = 0; i < promises.length; i++) {
            sumPromises += promises[i].promisedPower;
        }
        return sumPromises;
    }

    function getUserClosestOffer(address user) public returns(uint start, uint end, uint promisedReduction) {
        uint256 currentTime = getTime();
        for (uint i = 0; i < userOffers[user].length; i++) {
            if (offers[userOffers[user][i]].startTime - currentTime < 20) {
                start = offers[userOffers[user][i]].startTime;
                end = offers[userOffers[user][i]].endTime;
                promisedReduction = consumptionPromises[userOffers[user][i]].promisedPower;
            }
        }
    }

    // a wrapper for telegram: calling getUserClosestOffer with a secret number
    function TG_getClosestOffer(uint secretNumber) public returns(uint start, uint end, uint promisedReduction) {
        address userAddress = secretNumbersTG[secretNumber];
        return getUserClosestOffer(userAddress);
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
        return offers[id].reward;
    }

    function getOfferStart(uint id) public view returns(uint) {
        return offers[id].startTime;
    }

    function getOfferEnd(uint id) public view returns(uint) {
        return offers[id].endTime;
    }

    function getOfferInfo(uint id) public view returns (address initiator, uint neededPower, uint promisedPower, uint numOfPromisingUsers, uint reward, uint from, uint to) {
        promisedPower = getCurrentlyPromisedPower(id);
        numOfPromisingUsers = getPromisingUsers(id).length;
        initiator = offers[id].initiator;
        neededPower = offers[id].neededPower;
        reward = offers[id].reward;
        from = offers[id].startTime;
        to = offers[id].endTime;
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
        return (keccak256(user.typeOfUser) != keccak256(""));
    }

    // usual consumption is an array with all timestamps for the day (24 hours) with typical consumption of user
    function addNewUser(string typeOfUser, uint[] usualConsumption) public {
        address userAddress = msg.sender;
        users[userAddress] = Peer({typeOfUser: typeOfUser, balance: 0});
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
