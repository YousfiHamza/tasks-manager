import { GetUser } from './../auth/get-user.decorator'
import { CreateTaskDto } from './dto/create-task.dto'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { TasksService } from './tasks.service'
import { UpdateTaskDto } from './dto/update-todo.dto'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { Task } from './task.entity'
import { AuthGuard } from '@nestjs/passport'
import { User } from 'src/auth/user.entity'

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(@Query() getTasksFilterDto: GetTasksFilterDto, @GetUser() user: User): Promise<Task[]> {
    return this.taskService.getTasks(getTasksFilterDto, user)
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.taskService.getTaskById(id, user)
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User): Promise<Task> {
    return this.taskService.createTask(createTaskDto, user)
  }

  @Patch()
  updateTask(@Body() updateTaskDto: UpdateTaskDto, @GetUser() user: User): Promise<Task> {
    return this.taskService.updateTask(updateTaskDto, user)
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<string> {
    return this.taskService.deleteTask(id, user)
  }
}
