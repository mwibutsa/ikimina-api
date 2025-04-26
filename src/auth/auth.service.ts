import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if user with email already exists
    if (registerDto.email) {
      const existingUser = await this.userService.getUserByEmail(
        registerDto.email,
      );

      if (registerDto.phoneNumber) {
        const existingUserByPhone = await this.userService.getUserByPhoneNumber(
          registerDto.phoneNumber,
        );
        if (existingUserByPhone) {
          throw new ConflictException(
            'User with the provided phone number already exists',
          );
        }
      }
      if (existingUser) {
        throw new ConflictException(
          'User with the provided email already exists',
        );
      }
    }

    // Hash the password
    const hashedPassword = await this.hashPassword(
      registerDto.password ?? registerDto.phoneNumber,
    );

    // Create the user
    const newUser = await this.userService.createUser({
      email: registerDto.email,
      password: hashedPassword,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      phoneNumber: registerDto.phoneNumber,
      ipAddress: registerDto.ipAddress,
    });

    // Generate JWT token
    const token = this.generateToken(newUser.id);

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phoneNumber: newUser.phoneNumber,
        ipAddress: newUser.ipAddress,
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    // Find user by email
    const user = await this.userService.getUserByPhoneNumber(
      loginDto.phoneNumber,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await this.comparePasswords(
      loginDto.password,
      user.password as string,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update IP address if provided
    if (loginDto.ipAddress && loginDto.ipAddress !== user.ipAddress) {
      await this.userService.updateUser(user.id, {
        ipAddress: loginDto.ipAddress,
      });
    }

    // Generate JWT token
    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        ipAddress: loginDto.ipAddress || user.ipAddress,
      },
      token,
    };
  }

  private generateToken(userId: string): string {
    const payload = { sub: userId };
    return this.jwtService.sign(payload);
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  private async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
