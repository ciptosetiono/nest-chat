import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class WsJwtGuard extends AuthGuard('jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();

    //get jwt token from client
    const token =
      client.handshake.auth?.token ||
      client.handshake.headers?.authorization?.split(' ')[1];

    //throw exception if token not provided
    if (!token) {
      return this.throwUnauthorized(client, 'Unauthorized: No token provided');
    }

    try {
       //get jwt secet from env file
      const secret = this.configService.get('JWT_SECRET') || 'your-default-secret';
      
      //get the payload from the jwt token
      const payload = jwt.verify(token, secret, { ignoreExpiration: false });

      //throw exception if user not found
      if(!payload || !payload.sub ){
        return this.throwUnauthorized(client, 'Unauthorized: Invalid or expired token');
      }

      //find user by userId (paylod.sub) in database
      const user = await this.authService.findUser(payload.sub?.toString() || '');

      //throw exception if user not found
      if(!user){
        return this.throwUnauthorized(client, 'Unauthorized: User not found');
      }
        
      client.data.user = user;
      return true;
    } catch (error) {
      return this.throwUnauthorized(client, `Unauthorized: ${error.message}`);
    }
    
    return false;

  }

  throwUnauthorized(client, errorMessage){
    //throw new UnauthorizedException(errorMessage);
    client.emit('auth_error', { message: errorMessage });
    client.disconnect();
    return false;
  }

  
}

