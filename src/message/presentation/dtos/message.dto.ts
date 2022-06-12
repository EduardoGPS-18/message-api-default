import { UserDto } from './user.dto';

export class MessageDto {
  id: string;
  sender: UserDto;
  text: string;
  sendedIn: Date;
}
