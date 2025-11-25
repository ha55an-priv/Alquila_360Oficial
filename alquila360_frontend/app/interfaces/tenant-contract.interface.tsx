export interface TenantContract {
  id: string;
  propertyName: string;
  price: number;
  ownerName: string;
  startDate: string;
  endDate: string;
}

export interface TenantContractDetail {
  id: string;
  propertyName: string;
  price: number;
  ownerName: string;
  address: string;
  startDate: string;
  endDate: string;
  description: string;
}