import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { QueueModule } from 'src/queue/queueModule';

@Module({
  imports: [TypeOrmModule.forFeature([User]), QueueModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
