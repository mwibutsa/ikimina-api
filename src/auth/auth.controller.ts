import { Body, Controller, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad request, validation error or user already exists',
  })
  @ApiHeader({ name: 'X-Client-IP', required: false })
  register(
    @Body() registerDto: RegisterDto,
    @Headers('x-client-ip') clientIp?: string,
  ) {
    if (clientIp && !registerDto.ipAddress) {
      registerDto.ipAddress = clientIp;
    }
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Log in an existing user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid credentials',
  })
  @ApiHeader({ name: 'X-Client-IP', required: false })
  login(@Body() loginDto: LoginDto, @Headers('x-client-ip') clientIp?: string) {
    if (clientIp && !loginDto.ipAddress) {
      loginDto.ipAddress = clientIp;
    }
    return this.authService.login(loginDto);
  }
}
