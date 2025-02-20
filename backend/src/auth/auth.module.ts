import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../user/user.schema';
import { JwtStrategy } from './strategy';
import { JwtModule } from '@nestjs/jwt';
import { WsJwtGuard } from './guard/ws-jwt.guard';

@Module({
  imports:[
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.register({})
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    WsJwtGuard, 
  ],
})

export class AuthModule {}

