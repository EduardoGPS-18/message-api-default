import { UserEntity } from 'src/auth/domain/entities';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { GroupEntity } from './group.entity';

@Entity('message')
export class MessageEntity {
  @PrimaryColumn({ length: 255, unique: true })
  id: string;

  @ManyToOne((_) => UserEntity, (user) => user.id, { eager: true })
  @JoinColumn()
  sender: UserEntity;

  @Column({ type: 'text' })
  text: string;

  @Column()
  sendedIn: Date;

  @ManyToOne((_) => GroupEntity, (group) => group.id)
  group: GroupEntity;
}
