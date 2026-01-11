
export interface Offer {
  id: string;
  applicationId: string;
  candidateName: string;
  jobTitle: string;
  offerDate: string;
  statusId: number;
  statusName: string;
  offeredSalary: number;
  joiningDate: string | null;
  expiryDate: string | null;
  offerLetterPath: string | null;
  createdBy: string;
  createdByName: string;
  createdAt: string;
}

export interface CreateOfferDto {
  applicationId: string;
  offeredSalary: number;
  joiningDate: string; // ISO DateTime string
  expiryDate: string;  // ISO DateTime string
}

export interface UpdateOfferStatusDto {
  offerId: string;
  statusId: number; // 26 = Accepted, 27 = Rejected
}