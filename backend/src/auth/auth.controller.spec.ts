import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { BadRequestException, ForbiddenException, ValidationPipe } from "@nestjs/common";

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;
    let validationPipe: ValidationPipe;

    const mockAuthService = {
        signup: jest.fn(),
        signin: jest.fn(),
    };

    const mockUser = {
        _id: '12345',
        username: 'testuser',
        email: 'test@gmail.com',
        hash: 'hashedPassword',
        save: jest.fn().mockResolvedValue(true),
        toObject: jest.fn().mockReturnValue({
            _id: '12345',
            username: 'testuser',
            email: 'test@gmail.com',
        }),
    };

    const mockResponse = {
        user: mockUser,
        accessToken: 'valid_token',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
        validationPipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true });
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(authController).toBeDefined();
    });

    describe('register', () => {
        it('should return user and jwt token', async () => {
            const dto: RegisterDto = {
                username: 'testuser',
                email: 'test@gmail.com',
                password: 'password123',
            };

            mockAuthService.signup.mockResolvedValue(mockResponse);

            const result = await authController.register(dto);

            expect(result).toEqual(mockResponse);
            expect(authService.signup).toHaveBeenCalledWith(dto);
        });

        it('should throw bad request exception if not valid dto', async () => {
            const invalidDto: RegisterDto = {
                username: 'testuser',
                email: 'invalidEmail',//invalid email dto
                password: 'p',
            };

            await expect(validationPipe.transform(invalidDto, { type: 'body', metatype: RegisterDto }))
                .rejects.toThrow(BadRequestException);

            expect(authService.signup).not.toHaveBeenCalled();
        });
    });

    describe('login', () => {
        it('should return a user and token on successful login', async () => {
            const dto: LoginDto = {
                email: 'test@gmail.com',
                password: 'password123',
            };

            mockAuthService.signin.mockResolvedValue(mockResponse);

            const result = await authController.signin(dto);

            expect(result).toEqual(mockResponse);
            expect(authService.signin).toHaveBeenCalledWith(dto);
        });

        it('should throw BadRequestException when password is missing', async () => {
            const invalidDto: Partial<LoginDto> = { email: 'test@gmail.com' };

            await expect(validationPipe.transform(invalidDto, { type: 'body', metatype: LoginDto }))
                .rejects.toThrow(BadRequestException);
            expect(authService.signin).not.toHaveBeenCalled();
        });

        it('should throw ForbiddenException when credentials are incorrect', async () => {
            const invalidDto: LoginDto = {
                email: 'wronguser@gmail.com',
                password: 'wrongpassword',
            };

            mockAuthService.signin.mockRejectedValue(new ForbiddenException('Invalid credentials'));

            await expect(authController.signin(invalidDto)).rejects.toThrow(ForbiddenException);
            expect(authService.signin).toHaveBeenCalledWith(invalidDto);
        });
    });
});
