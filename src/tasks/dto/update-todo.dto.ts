import { TaskStatus } from '../task-status.enum'
import { IsEnum, IsNotEmpty } from 'class-validator'

export class UpdateTaskDto {
  @IsNotEmpty()
  id: string

  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  description: string

  @IsEnum(TaskStatus)
  status: TaskStatus
}
