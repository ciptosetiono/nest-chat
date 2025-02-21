import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { User, UserDocument } from 'src/user/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  /*
  * 
  */
  /**
   * Registers a new user with the provided registration details.
   *
   * @param {RegisterDto} dto - The registration details including username, email, and password.
   * @returns {Promise<{ user: User, accessToken: string }>} - A promise that resolves to an object containing the newly created user and an access token.
   * @throws {BadRequestException} - If the username or email already exists.
   */
  async signup(dto: RegisterDto): Promise<{ user: User, accessToken: string }> {

    const usernameExisted = await this.findUserByUsername(dto.username);
    if (usernameExisted) {
      console.log('username existed');
      throw new BadRequestException('Username already exists');
    }

    // Check if email already taken
    const emailExisted = await this.findUserByEmail(dto.email);
    if (emailExisted) {
      throw new BadRequestException('Email already exists');
    }

    try {
      // Encrypt password
      const hashedPassword = await argon.hash(dto.password);

      // Create new user
      const user = new this.userModel({ ...dto, hash: hashedPassword, _id: new Types.ObjectId() });

      // Save the new user
      const savedUser: UserDocument = await user.save();

      // Sign JWT access token
      const token: string = await this.signToken(savedUser._id.toString(), savedUser.email);

      // Convert user to object and remove hash field
      const userObject = savedUser.toObject();
      delete userObject.hash;

      // Return user and accesToken
      return {
        user: userObject,
        accessToken: token,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Authenticates a user and generates an access token.
   *
   * @param {LoginDto} dto - The data transfer object containing the user's login credentials.
   * @returns {Promise<{ user: User, accessToken: string }>} A promise that resolves to an object containing the authenticated user and the generated access token.
   * @throws Will throw an error if authentication fails.
   */
  async signin(dto: LoginDto): Promise<{ user: User, accessToken: string }> {
    try {

      // Validate username and password, if not valid it will throw expection
      const user: User = await this.validateUser(dto.email, dto.password);

      // Sign JWT access token
      const token: string = await this.signToken(user._id.toString(), user.email);

      // Return user and token
      return {
        user: user,
        accessToken: token,
      };
    } catch (error) {
      throw error;
    }
  }

 
  /**
   * Validates a user based on the provided identifier.
   * 
   * This method attempts to find a user by their email or username. If a user is found,
   * it verifies the provided password against the stored hash. If the password matches,
   * the user object is returned without the password hash.
   * 
   * @param identifier - The email or username of the user to be validated.
   * @param password - The password to be validated.
   * @returns A promise that resolves to the validated user object without the password hash.
   * @throws {ForbiddenException} If the user is not found or the credentials are incorrect.
   */
  async validateUser(identifier: string, password: string): Promise<User> {
    // Find user by email or username
    const user = await this.userModel.findOne({ $or: [{ email: identifier }, { username: identifier }] }).lean();
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // Validate the password
    const pwMatches = await argon.verify(user.hash, password);
    if (!pwMatches) {
      throw new ForbiddenException('Credentials incorrect');
    }

    // Remove hash for response
    delete (user as Record<string, unknown>).hash;

    return user;
  }

  /**
   * Find User BY User ID
   * @param userId 
   * @returns A promise that resolves to the User
   * @throws notfound if user not found
   */
  async findUser(userId: string | number): Promise<User> {
    // Convert userId to ObjectId
    const objectUserId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;

    // Find user by user object id
    const user = await this.userModel.findOne({ _id: objectUserId }).lean();

     // Throw error if user not found
    if (!user) {
    throw new NotFoundException('User not found');
    }

    //for safety, delete hash first before send asresponse
    delete (user as Record<string, unknown>).hash;
    return user;
   
  }

  async findUserByUsername(username: string): Promise<User | null> {
    return await this.userModel.findOne({ 'username': username });
  }


  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ 'email': email });
  }


  /**
   * Generates a signed JWT token for the given user.
   *
   * @param userId - The unique identifier of the user. Can be a string or a number.
   * @param email - The email address of the user.
   * @returns A promise that resolves to the signed JWT token as a string.
   *
   */
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
