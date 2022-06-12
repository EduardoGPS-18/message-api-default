import { IsUUID } from 'class-validator';

export class AddUserOnGroupDto {
  @IsUUID()
  groupId: string;

  @IsUUID()
  userId: string;
}
