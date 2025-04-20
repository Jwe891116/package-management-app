import { IPackage } from "../interfaces/iPackage";

export class Package implements IPackage {
  constructor(
      private _senderName: string,
      private _senderAddress: string,
      private _receiverName: string,
      private _receiverAddress: string,
      private _weight: number,
      private _shippingMethod: string,
      private _costPerUnitWeight: number,
      private _status: string,
      private _trackingNumber: string
  ) {}
  senderName!: string;
  senderAddress!: string;
  receiverName!: string;
  receiverAddress!: string;
  weight!: number;
  shippingMethod!: string;
  costPerUnitWeight!: number;
  status!: string;
  trackingNumber!: string;
  totalCost?: number | undefined;

  // Implement all getters and setters
  setSenderName(name: string): void { this._senderName = name; }
  getSenderName(): string { return this._senderName; }

  setSenderAddress(address: string): void { this._senderAddress = address; }
  getSenderAddress(): string { return this._senderAddress; }

  setReceiverName(name: string): void { this._receiverName = name; }
  getReceiverName(): string { return this._receiverName; }

  setReceiverAddress(address: string): void { this._receiverAddress = address; }
  getReceiverAddress(): string { return this._receiverAddress; }

  setWeight(weight: number): void { this._weight = weight; }
  getWeight(): number { return this._weight; }

  setShippingMethod(method: string): void { this._shippingMethod = method; }
  getShippingMethod(): string { return this._shippingMethod; }

  setCostPerUnitWeight(cost: number): void { this._costPerUnitWeight = cost; }
  getCostPerUnitWeight(): number { return this._costPerUnitWeight; }

  setStatus(status: string): void { this._status = status; }
  getStatus(): string { return this._status; }

  setTrackingNumber(trackingNumber: string): void { this._trackingNumber = trackingNumber; }
  getTrackingNumber(): string { return this._trackingNumber; }

  calculateCost(): number {
      return this._weight * this._costPerUnitWeight;
  }

  printLabel(): string {
      return `
Sender: ${this._senderName}, ${this._senderAddress}
Receiver: ${this._receiverName}, ${this._receiverAddress}
Weight: ${this._weight} kg
Shipping Method: ${this._shippingMethod}
Status: ${this._status}
Tracking Number: ${this._trackingNumber}
`;
  }

  updateStatus(newStatus: string): void {
      this._status = newStatus;
  }
}