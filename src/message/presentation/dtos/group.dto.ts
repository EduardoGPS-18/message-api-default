import { UserDto } from './user.dto';

export class GroupDto {
  id: string;
  name: string;
  description: string;
  owner: UserDto;
  users: UserDto[];
}
