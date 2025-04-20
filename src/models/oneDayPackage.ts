import { Package } from './package';
import { IOneDay } from '../interfaces/iOneDayPackage';

export class OneDay extends Package implements IOneDay {
    constructor(
        senderName: string,
        senderAddress: string,
        receiverName: string,
        receiverAddress: string,
        weight: number,
        shippingMethod: string,
        costPerUnitWeight: number,
        status: string,
        trackingNumber: string,
        private _flatFee: number
    ) {
        super(
            senderName,
            senderAddress,
            receiverName,
            receiverAddress,
            weight,
            shippingMethod,
            costPerUnitWeight,
            status,
            trackingNumber
        );
    }
    flatFee!: number;

    setFlatFee(fee: number): void { this._flatFee = fee; }
    getFlatFee(): number { return this._flatFee; }

    calculateCost(): number {
        return super.calculateCost() + this._flatFee;
    }
}