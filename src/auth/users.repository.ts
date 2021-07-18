import { AuthCredentialsDto } from './dto/auth-credentials.dto'
import { EntityRepository, Repository } from 'typeorm'
import { User } from './user.entity'
import { ConflictException, InternalServerErrorException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  // User Creation
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto

    // Password Hashing
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)

    // User Creation
    const user = this.create({ username, password: hashedPassword })

    try {
      await this.save(user)
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException('This Username Already Exists')
      } else {
        throw new InternalServerErrorException()
      }
    }
  }
}
