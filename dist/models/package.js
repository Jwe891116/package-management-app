"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Package = void 0;
class Package {
    constructor(_senderName, _senderAddress, _receiverName, _receiverAddress, _weight, _shippingMethod, _costPerUnitWeight, _status, _trackingNumber) {
        this._senderName = _senderName;
        this._senderAddress = _senderAddress;
        this._receiverName = _receiverName;
        this._receiverAddress = _receiverAddress;
        this._weight = _weight;
        this._shippingMethod = _shippingMethod;
        this._costPerUnitWeight = _costPerUnitWeight;
        this._status = _status;
        this._trackingNumber = _trackingNumber;
    }
    // Implement all getters and setters
    setSenderName(name) { this._senderName = name; }
    getSenderName() { return this._senderName; }
    setSenderAddress(address) { this._senderAddress = address; }
    getSenderAddress() { return this._senderAddress; }
    setReceiverName(name) { this._receiverName = name; }
    getReceiverName() { return this._receiverName; }
    setReceiverAddress(address) { this._receiverAddress = address; }
    getReceiverAddress() { return this._receiverAddress; }
    setWeight(weight) { this._weight = weight; }
    getWeight() { return this._weight; }
    setShippingMethod(method) { this._shippingMethod = method; }
    getShippingMethod() { return this._shippingMethod; }
    setCostPerUnitWeight(cost) { this._costPerUnitWeight = cost; }
    getCostPerUnitWeight() { return this._costPerUnitWeight; }
    setStatus(status) { this._status = status; }
    getStatus() { return this._status; }
    setTrackingNumber(trackingNumber) { this._trackingNumber = trackingNumber; }
    getTrackingNumber() { return this._trackingNumber; }
    calculateCost() {
        return this._weight * this._costPerUnitWeight;
    }
    printLabel() {
        return `
Sender: ${this._senderName}, ${this._senderAddress}
Receiver: ${this._receiverName}, ${this._receiverAddress}
Weight: ${this._weight} kg
Shipping Method: ${this._shippingMethod}
Status: ${this._status}
Tracking Number: ${this._trackingNumber}
`;
    }
    updateStatus(newStatus) {
        this._status = newStatus;
    }
}
exports.Package = Package;
