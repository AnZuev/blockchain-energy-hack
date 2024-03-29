pragma solidity ^0.4.19;

contract CoreContract {

    event OfferIdMention(
        uint id
    );
    event OfferResponded(
        uint offer_id,
        uint startTime,
        uint endTime,
        uint promisedPower,
        address user_address
    );

    struct Peer {
        string name;
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
    uint time;


    function CoreContract() public {
        owner = msg.sender;
        time = 0;
    }

    function getOwner() public view returns(address){
        return owner;
    }

    function setObserver(address obs) public{
        require(msg.sender == owner);
        observer = obs;
    }

    function updateTime(uint nextTime) public{
        //require(msg.sender == observer);
        time = nextTime;
        uint[] memory justFinished = getJustFinishedOffers(nextTime);
        for (uint i = 0; i < justFinished.length; i++) {
            if(justFinished[i] == 0){
                break;
            }
            address[] memory promisingUsers = getPromisingUsers(justFinished[i]);
            for (uint j = 0; j < promisingUsers.length; j++) {
                payToUser(promisingUsers[j], justFinished[i]);
            }
        }
    }

    function getJustFinishedOffers(uint currentTime) public view returns(uint[]) {
        uint[] memory justFinished = new uint[](20);
        uint pointer = 0;
        for (uint i = 1; i <= numberOfOffers; i++) {
            if (offers[i].endTime == (currentTime - 1)) {
                justFinished[pointer] = i;
                pointer += 1;
                if(pointer == 20){
                    return justFinished;
                }
            }
        }
        return justFinished;
    }

    function getTime() public view returns (uint){
        return time;
    }

    function giveMoneyToUser() public {
        address user = msg.sender;
        uint currentBalance = users[msg.sender].balance;
        users[user].balance = 0;
        user.transfer(currentBalance);
    }

    function getOffersByUser() public view returns(uint[]){
        return userOffers[msg.sender];
    }

    // for telegram shit (by Sonya)
    function addNewSecretNum(uint number) public {
        secretNumbersTG[number] = msg.sender;
    }

    //for telegram shit (by Sonya)
    function getAddress(uint number) public view returns(address){
        return secretNumbersTG[number];
    }

    //for telegram shit (by Sonya)
    function checkIsUserHasConnected(uint number) public view returns(bool) {
        if (secretNumbersTG[number] != address(0)) {
            return true;
        }
        else {
            return false;
        }
    }

    // check user consumption
    function checkUserCons(address user, uint offerId) public view returns(bool) {
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

    //
    function payToUser(address user, uint offerId) public {
        bool result = checkUserCons(user, offerId);
        if (result) {
            uint reward = offers[offerId].reward;
            users[user].balance += reward * getPromisedPower(offerId, user);
        }
    }


    // reward is actually an amount of ether that was sent by the user
    // at this point ethereum platform guarantees that user
    // returns an id of newly created offer
    function addNewOffer(uint power, uint startTime, uint endTime) payable public{
        address initiator = msg.sender;
        uint reward = msg.value;
        numberOfOffers = numberOfOffers + 1;
        uint rewardPerWatt = reward/power;
        offers[numberOfOffers] = Offer({initiator: initiator, neededPower: power, reward: rewardPerWatt, startTime: startTime, endTime: endTime});
    }

    // returns array of offer ids
    // pass currentTime = 0 to get all future offers
    // for now returns only 20 offers
    // in the future offset could be introduced
    function getAvailableOffers(uint currentTime) public view returns(uint[]){
        if (currentTime == 0){
            currentTime = time;
        }

        uint[] memory availableOffers = new uint[](20);
        uint pointer = 0;
        for (uint i = 1; i <= numberOfOffers; i++) {
            if (offers[i].startTime > currentTime) {
                availableOffers[pointer] = i;
                pointer += 1;
                if(pointer == 20){
                    return availableOffers;
                }
            }
        }
        return availableOffers;
    }


    // uint offer_id,
    // uint startTime,
    // uint endTime,
    // uint promisedPower,
    // address user_address
    function respondToOffer(uint id, uint power) public {
        address user = msg.sender;
        consumptionPromises[id].push(ConsPromise({promisingUser: user, promisedPower: power}));
        userOffers[user].push(id);
        OfferResponded(id, getOfferStart(id), getOfferEnd(id), power, user);
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

    function getOfferInfo(uint id)
    public
    view
    returns (address initiator, uint neededPower, uint promisedPower, uint numOfPromisingUsers, uint reward, uint from, uint to, string initiatorName) {
        promisedPower = getCurrentlyPromisedPower(id);
        numOfPromisingUsers = getPromisingUsers(id).length;
        initiator = offers[id].initiator;
        neededPower = offers[id].neededPower;
        reward = offers[id].reward;
        from = offers[id].startTime;
        to = offers[id].endTime;
        initiatorName = users[initiator].name;
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
    function addNewUser(string name, string typeOfUser, uint[] usualConsumption) public {
        address userAddress = msg.sender;
        users[userAddress] = Peer({typeOfUser: typeOfUser, balance: 0, name: name});
        for (uint i = 0; i < usualConsumption.length; i++) {
            users[userAddress].usualConsumption[i] = usualConsumption[i];
        }
    }

    function addNewSlot(uint consumption) public {
        require(consumption > 0);
        consumptionDB[time].push(Slot(msg.sender, consumption));
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
