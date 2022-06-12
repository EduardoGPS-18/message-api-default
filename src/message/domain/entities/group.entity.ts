import { UserEntity } from 'src/auth/domain/entities';
import { MessageEntity } from 'src/message/domain/entities/message.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity('group')
export class GroupEntity {
  @PrimaryColumn({ unique: true })
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne((_) => UserEntity, (user) => user, { eager: true })
  owner: UserEntity;

  @ManyToMany((_) => UserEntity, (user) => user.id, { eager: true })
  @JoinTable({
    name: 'users-group',
    joinColumn: {
      name: 'groupId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
  })
  users: UserEntity[];

  @OneToMany((_) => MessageEntity, (message) => message, { nullable: true })
  messages: MessageEntity[];
}
