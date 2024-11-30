import type { Request as ExpressRequest } from 'express';
import type { Request as NestRequest } from '@nestjs/common';
import { User } from '../modules/users/schemas/user.schema';
import { Profile as FaceBookProfile } from 'passport-facebook';
import { Profile as GoogleProfile } from 'passport-google-oauth20';

type CombinedRequest = ExpressRequest & typeof NestRequest;

export interface IUserRequest extends CombinedRequest {
  user: User;
}

export interface IOAuthRequestUser {
  profile: GoogleProfile | FaceBookProfile;
}

export interface IOAuthRequest extends CombinedRequest {
  user: IOAuthRequestUser;
}
