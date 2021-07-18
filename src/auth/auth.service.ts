import { JwtPayload } from './jwt-payload.interface'
import { UsersRepository } from './users.repository'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(authCredentialsDto)
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto
    const myUser = await this.usersRepository.findOne({ username })
    if (myUser && (await bcrypt.compare(password, myUser.password))) {
      const payload: JwtPayload = { username }
      const accessToken: string = this.jwtService.sign(payload)
      return { accessToken }
    }
    throw new UnauthorizedException('Please Check Your Credentials !')
  }
}
