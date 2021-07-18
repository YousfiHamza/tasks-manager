import { CreateTaskDto } from './dto/create-task.dto'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { TasksService } from './tasks.service'
import { UpdateTaskDto } from './dto/update-todo.dto'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { Task } from './task.entity'

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(@Query() getTasksFilterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskService.getTasks(getTasksFilterDto)
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Promise<Task> {
    return this.taskService.getTaskById(id)
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.createTask(createTaskDto)
  }

  @Patch()
  updateTask(@Body() updateTaskDto: UpdateTaskDto): Promise<Task> {
    return this.taskService.updateTask(updateTaskDto)
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): Promise<string> {
    return this.taskService.deleteTask(id)
  }
}
