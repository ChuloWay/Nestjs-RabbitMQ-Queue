import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { ProducerService } from 'src/queue/producer.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private producerService: ProducerService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, phone } = createUserDto;

    // Check if a user with the same email already exists
    const existingUserByEmail = await this.findOneByEmail(email);
    if (existingUserByEmail) {
      throw new ConflictException('User with this email already exists');
    }

    // Check if a user with the same phone already exists
    if (phone) {
      const existingUserByPhone = await this.findOneByPhone(phone);
      if (existingUserByPhone) {
        throw new ConflictException(
          'User with this phone number already exists',
        );
      }
    }

    // Create and save the new user
    const newUser = this.userRepository.create(createUserDto);
    const user = await this.userRepository.save(newUser);

    // send an email to the newly created user
    const emailData = {
      email: user.email,
      subject: 'Welcome to Our Community',
      html: `<p>Hello ${user.username},</p>
      <p>Welcome to our community! Your account is now active.</p>
      <p>Use the following credentials to log in:</p>
      <ul>
        <li><strong>Email:</strong> ${user.email}</li>
      </ul>
      <p>Enjoy your time with us!</p>`,
    };

    await this.producerService.addToEmailQueue(emailData);

    return user;
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOneById(id: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findOneByPhone(phone: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { phone } });
  }
}
