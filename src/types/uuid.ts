import { IsUUID } from 'class-validator';

export class IsUuidParams {
  @IsUUID()
  id: string;
}
