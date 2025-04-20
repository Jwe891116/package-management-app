export interface IPackage {
  // Properties
  senderName: string;
  senderAddress: string;
  receiverName: string;
  receiverAddress: string;
  weight: number;
  shippingMethod: string;
  costPerUnitWeight: number;
  status: string;
  trackingNumber: string;
  totalCost?: number;

  // Methods
  calculateCost(): number;
  printLabel(): string;
  updateStatus(newStatus: string): void;

  // Getters and setters
  setSenderName(name: string): void;
  getSenderName(): string;
  setSenderAddress(address: string): void;
  getSenderAddress(): string;
  setReceiverName(name: string): void;
  getReceiverName(): string;
  setReceiverAddress(address: string): void;
  getReceiverAddress(): string;
  setWeight(weight: number): void;
  getWeight(): number;
  setShippingMethod(method: string): void;
  getShippingMethod(): string;
  setCostPerUnitWeight(cost: number): void;
  getCostPerUnitWeight(): number;
  setStatus(status: string): void;
  getStatus(): string;
  setTrackingNumber(trackingNumber: string): void;
  getTrackingNumber(): string;
}