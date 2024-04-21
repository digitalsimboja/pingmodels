import { Photo } from './photo';

export class UserModel{
   
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
    accessToken: string;
    refreshToken: string;
    ID: string;
    role: string;
    lastLogin: string;
    avatar: string;
    coverImage: string;
    bio: string;
    followers: number;
    userId: string;
    publicPhotos: Photo[];
     
    }