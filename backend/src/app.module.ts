import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { RoomModule } from './room/room.module';
import { HoroscopeModule } from './horoscope/horoscope.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get('DATABASE_URL'),
       }),
      inject: [ConfigService],
      
    }),
    AuthModule,
    UserModule,
    ChatModule,
    RoomModule,
    HoroscopeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
