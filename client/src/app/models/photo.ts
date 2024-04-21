import { UserModel } from './user';

export class Photo {
    _id: string;
    imageUrl: string;
    imageTitle: string;
    imageDesc: string;
    imageControl: string;
    chargeNGN: string;
    chargeUSD: string;
    uploaded: Date;
    userId: UserModel[];
    
  }

  