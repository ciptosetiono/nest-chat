import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';

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
      throw new UnauthorizedException('No token provided');
    }

    try {
      //get jwt secet from env file
      const secret = this.configService.get('JWT_SECRET') || 'your-default-secret';
      //get payload from token
      const payload = jwt.verify(token, secret, { ignoreExpiration: true });
      if(payload.sub){
        //get user from
        const userId =  payload.sub.toString();
        const user = await this.authService.findUser(userId);
        if(!user){
          throw new UnauthorizedException('Invalid or expired token');
        }
        client.data.user = user; // Store decoded user data
        return true;
      }
      return false;
 // ✅ Attach user data to WebSocket client
    } catch (error) {
      console.error('[WsAuthGuard] Invalid or expired token:', error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }

  }
}

