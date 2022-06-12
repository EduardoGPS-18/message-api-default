import { UserEntity } from 'src/auth/domain/entities';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('message')
export class MessageEntity {
  @PrimaryColumn({ length: 255, unique: true })
  id: string;

  @OneToOne((_) => UserEntity, (user) => user.id, { eager: true })
  @JoinColumn()
  sender: UserEntity;

  @Column({ type: 'text' })
  text: string;

  @Column()
  sendedIn: Date;
}
