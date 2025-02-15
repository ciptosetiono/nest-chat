import {  Injectable, BadRequestException, ForbiddenException, NotFoundException  } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as argon  from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { User} from 'src/user/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: RegisterDto): Promise<{user: User, accessToken :string}> {

    //check if username already taken
    if (await this.findUserByUsername(dto.username)) {
      throw new BadRequestException ('Username already exists');
    }

    //check if email already taken
    if (await this.findUserByEmail(dto.email)) {
      throw new BadRequestException ('Email already exists');
    }

    try {
      //encrypt password
      const hashedPassword = await argon.hash(dto.password);

      //create new user
      const user =  new this.userModel({ ...dto, hash: hashedPassword, _id: new Types.ObjectId()});
     
      //save the new user
      const savedUser: User = await user.save();

      //sign jwt access token
      const token: string = await this.signToken(savedUser._id.toString(), savedUser.email);

      //send user and token
      return {
        user: savedUser,
        accessToken: token,
      }
    }
    catch(error){
      throw error;
    }
   
  }

  async signin(dto: LoginDto): Promise<{user: User, accessToken :string}>{
    try {

      //validate  username and pasword
      const user: User =  await this.validateUser(dto.email, dto.password);
      
      //sign jwt access token
      const token: string = await this.signToken(user._id.toString(), user.email);

        //send user and token
      return {
        user: user,
        accessToken: token,
      }

    }
    catch(error){
      throw error;
    }
  }


  async validateUser(identifier: string, password: string): Promise<User> {

    //find user by email or username
    const user = await this.userModel.findOne({$or: [{email: identifier}, {username: identifier}]});

    if (!user) {
      throw new ForbiddenException(`User not found`);
    }

    //validate the password
    const pwMatches = await argon.verify(user.hash,password);
    if (!pwMatches)
      throw new ForbiddenException('Credentials incorrect');
    return user;
  }



  //find user by ID
  async findUser(userId: string | number): Promise<User > {

    //convert userId to ObjectId
    const objectUserId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
    
    //find user by user object id
    const user = await this.userModel.findOne({ _id: objectUserId  }).lean(); 
    //return user if found
    if (user) {
      delete (user as Record<string, unknown>).hash;
      return user;
    }
    //throw error if user not found
    throw new NotFoundException('User not found');

  }

  async findUserByUsername(username:string):Promise<User | null>{
     return await this.userModel.findOne({'username': username});
  }

  async findUserByEmail(email:string):Promise<User | null>{
    return await this.userModel.findOne({'email': email});
 }

  async signToken(userId: string | number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    const expTime = this.config.get('JWT_EXP_TIME');

    const token = await this.jwt.signAsync(
      payload,
      {
        expiresIn: expTime,
        secret: secret,
      },
    );

    return token;

  }
  
}