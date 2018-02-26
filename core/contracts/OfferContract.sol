pragma solidity ^0.4.0;

contract OfferContract {

    struct Peer {
        address user;
        string typeOfUser;
        uint balance;
        uint usualConsumption;
    }

    // 5-minute slot
    struct Slot {
        address user;
        uint consumption;
    }

    struct Offer {
        uint offerId;
        address initiator;
        uint neededPower;
        uint reward;
        uint startTime;
        uint endTime;
        // address of executor => promised decrease
        mapping (address => uint) promises;
        uint currentPromisedPower;
        address[] promisingUsers;
    }

    Peer[] users;
    mapping (uint => Slot[]) public consumptionDB; // uint = timestamp
    Offer[] offers;

    address private observer; // to listen for new offers

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
        users.push(Peer(userAddress, typeOfUser, balance, consumption));
    }

    function addNewSlot(address userAddress, uint consumption, uint currentTime) public {
        consumptionDB[currentTime].push(Slot(userAddress, consumption));
    }

    // returns an array of available offer ids
    function getAvailableOffers(uint currentTime) public returns(uint[]) {
        uint[] availableOffers;
        for (uint i = 0; i < offers.length; i++) {
            // checking startTime and +20% of offered power
            if (offers[i].startTime > currentTime && offers[i].currentPromisedPower > offers[i].neededPower + 200) {
                availableOffers.push(offers[i].offerId);
            }
        }
        return availableOffers;
    }

    // returns information that we'll show to the user when they search for offers
    function getOfferInfo(uint offerId) public returns(uint, uint, uint, uint) {
        return (offers[offerId].neededPower, offers[offerId].reward, offers[offerId].startTime, offers[offerId].endTime);
    }

    // TODO
    function getPeerBalance(address adr) returns(uint){
        return 0;
    }

    // returns new offer id, reward is price per KWatt, power in KWatt
    function addNewOffer(address initiatorAddress, uint power, uint reward, uint startTime, uint endTime) public returns(uint) {
        // TODO: get PeerBalance first
        if (initiator.balance < reward * power) return -1;
        else {
            uint newOfferId = offers.length;
            offers.push(Offer(newOfferId, initiatorAddress, power, reward, startTime, endTime));
            return newOfferId;
        }
    }

    function respondToOffer(address respondent, uint power, uint offerId) {
        offers[offerId].promises[respondent] = power;
        offers[offerId].currentPromisedPower += power;
        offers[offerId].promisingUsers.push(respondent);
    }

    function checkConsumption(uint offerId) {
        Offer currentOffer = offers[offerId];
        address[] userAddresses = currentOffer.promisingUsers;
    }



}
