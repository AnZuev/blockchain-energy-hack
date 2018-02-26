pragma solidity ^0.4.0;

contract OfferContract {

    struct Peer {
        address user;
        string type;
        uint balance;
        uint usualConsumption;
    }

    // 5-minute slot
    struct Slot {
        address user;
        uint timestamp;
        uint consumption;
    }

    struct Offer {
        uint offerId;
        Peer initiator;
        uint neededPower;
        uint reward;
        uint startTime;
        uint endTime;
        // address of executor => promised decrease
        mapping (address => uint) promises;
    }

    Peer[] public users;
    Slot[] public database; // all 5 minute slots
    Offer[] public offers;

    address private observer; // to listen for new offers

    // constructor
    function OfferContract() {

    }

    function setObserver(address obs) private {
        observer = obs;
    }

    function addNewUser(address userAddress, string type, uint balance, uint consumption) public {
        users.push(Peer(userAddress, type, balance, consumption));
    }

    function addNewSlot(address userAddress, uint time, uint cons) public {
        database.push(Slot(userAddress, time, cons));
    }

    // returns an array of available offer ids
    function getAvailableOffers(uint currentTime) public returns(uint[]) {
        uint[] availableOffers;
        for (uint i = 0; i < offers.length; i++) {
            if (offers[i].startTime > currentTime) availableOffers.push(offers[i].offerId);
        }
        return availableOffers;
    }

    // returns information that we'll show to the user when they search for offers
    function getOfferInfo(uint offerId) public returns(uint, uint, uint, uint) {
        return (offers[offerId].neededPower, offers[offerId].reward, offers[offerId].startTime, offers[offerId].endTime);
    }

    // returns new offer id, reward is price per KWatt, power in KWatt
    function addNewOffer(Peer initiator, uint power, uint reward, uint startTime, uint endTime) public returns(uint) {
        if (initiator.balance < reward * power) return -1;
        else {
            uint newOfferId = offers.length;
            offers.push(Offer(newOfferId, initiator, power, reward, startTime, endTime));
            return newOfferId;
        }
    }

    function respondToOffer(address respondent, uint power, uint offerId) {
        offers[offerId].promises[respondent] = power;

    }



}
