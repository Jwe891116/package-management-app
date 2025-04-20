"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoDay = void 0;
const package_1 = require("./package");
class TwoDay extends package_1.Package {
    constructor(senderName, senderAddress, receiverName, receiverAddress, weight, shippingMethod, costPerUnitWeight, status, trackingNumber, _flatFee) {
        super(senderName, senderAddress, receiverName, receiverAddress, weight, shippingMethod, costPerUnitWeight, status, trackingNumber);
        this._flatFee = _flatFee;
    }
    setFlatFee(fee) { this._flatFee = fee; }
    getFlatFee() { return this._flatFee; }
    calculateCost() {
        return super.calculateCost() + this._flatFee;
    }
}
exports.TwoDay = TwoDay;
