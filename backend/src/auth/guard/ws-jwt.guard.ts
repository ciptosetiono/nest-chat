import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../../auth/auth.service';

/**
 * WebSocket JWT Guard that extends the AuthGuard with 'jwt' strategy.
 * This guard is responsible for validating JWT tokens in WebSocket connections.
 */
@Injectable()
export class WsJwtGuard extends AuthGuard('jwt') {
  /**
   * Constructor to inject ConfigService and AuthService.
   * @param configService - Service to access application configuration.
   * @param authService - Service to handle authentication-related operations.
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super();
  }

  /**
   * Method to determine if the current request is authorized.
   * @param context - ExecutionContext providing details about the current request.
   * @returns A promise that resolves to a boolean indicating if the request is authorized.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();

    // Get JWT token from client
    const token =
      client.handshake.auth?.token ||
      client.handshake.headers?.authorization?.split(' ')[1];

    // Throw exception if token not provided
    if (!token) {
      return this.throwUnauthorized(client, 'Unauthorized: No token provided');
    }

    try {
      // Get JWT secret from environment variables
      const secret = this.configService.get('JWT_SECRET') || 'your-default-secret';
      
      // Get the payload from the JWT token
      const payload = jwt.verify(token, secret, { ignoreExpiration: false });

      // Throw exception if payload invalid
      if (!payload || !payload.sub) {
        return this.throwUnauthorized(client, 'Unauthorized: Invalid or expired token');
      }

      // Find user by userId (payload.sub) in database
      const user = await this.authService.findUser(payload.sub?.toString() || '');

      // Throw exception if user not found
      if (!user) {
        return this.throwUnauthorized(client, 'Unauthorized: User not found');
      }
      
      //return that user is autenticathed
      client.data.user = user;
      return true;
    } catch (error) {
      return this.throwUnauthorized(client, `Unauthorized: ${error.message}`);
    }
    
    return false;
  }

  /**
   * Helper method to handle unauthorized access.
   * Emits an 'auth_error' event to the client and disconnects the client.
   * @param client - The WebSocket client.
   * @param errorMessage - The error message to send to the client.
   * @returns Always returns false.
   */
  throwUnauthorized(client, errorMessage) {
    client.emit('auth_error', { message: errorMessage });
    client.disconnect();
    return false;
  }
}

