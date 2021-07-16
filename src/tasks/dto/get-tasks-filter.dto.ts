import { TaskStatus } from '../task.model'
import { IsOptional, IsEnum, IsString } from 'class-validator'

export class GetTasksFilterDto {
    @IsOptional()
    @IsString()
    search?: string

    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus
}
