import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

/**
 * JwtStrategy class that extends PassportStrategy to handle JWT authentication.
 * 
 * @class
 * @extends {PassportStrategy(Strategy)}
 * @implements {PassportStrategy}
 * 
 * @constructor
 * @param {ConfigService} configService - Service to access application configuration.
 * @param {AuthService} authService - Service to handle authentication logic.
 * 
 * @method validate
 * @async
 * @param {Object} payload - The JWT payload containing user information.
 * @param {number} payload.sub - The user ID.
 * @param {string} payload.email - The user email.
 * @returns {Promise<User>} - Returns a promise that resolves to the user object.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: number; email: string }) {
    return this.authService.findUser(payload.sub);
  }
}
