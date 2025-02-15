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
      
      //get the payload from the jwt token
      const payload = jwt.verify(token, secret, { ignoreExpiration: true });

      //check the payload for the user id
      if(payload.sub){
        //user id is take from payload.sub
        const userId =  payload.sub.toString();

        //find user by id in database
        const user = await this.authService.findUser(userId);

        //throw exception if user not found
        if(!user){
          throw new UnauthorizedException('Invalid or expired token');
        }

        //store user data in client object
        client.data.user = user;

        //return true if user found
        return true;
      }
      return false;

    } catch (error) {

      //log error to console
      console.error('[WsAuthGuard] Invalid or expired token:', error.message);

      //throw exception if token is invalid or expired
      throw new UnauthorizedException('Invalid or expired token');
    }

  }
}

