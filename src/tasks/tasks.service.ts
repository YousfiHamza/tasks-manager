import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { CreateTaskDto } from './dto/create-task.dto'
import { TaskStatus } from './task-status.enum'
import { Injectable, NotFoundException } from '@nestjs/common'
import { v4 as uuid } from 'uuid'
import { UpdateTaskDto } from './dto/update-todo.dto'
import { TasksRepository } from './tasks.repository'
import { InjectRepository } from '@nestjs/typeorm'
import { Task } from './task.entity'
import { User } from 'src/auth/user.entity'
import { GetUser } from 'src/auth/get-user.decorator'

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository
  ) {}

  getTasks(filter: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filter, user)
  }

  // GET BY ID
  async getTaskById(id: string, @GetUser() user: User): Promise<Task> {
    const found = await this.tasksRepository.findOne({ where: { id, user } })
    if (!found) {
      throw new NotFoundException(`Task ${id} Not Found !`)
    }
    return found
  }

  // POST
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user)
  }

  // UPDATE
  async updateTask(updateTaskDto: UpdateTaskDto, @GetUser() user: User): Promise<Task> {
    const task = await this.getTaskById(updateTaskDto.id, user)
    const myTask = await this.tasksRepository.save({ ...updateTaskDto, user })
    if (!myTask || !task) {
      throw new NotFoundException(`Can't Update ${updateTaskDto.title} !`)
    }
    return myTask
  }

  // DELETE
  async deleteTask(id: string, @GetUser() user: User): Promise<string> {
    const task = await this.getTaskById(id, user)
    const deleted = await this.tasksRepository.delete(task.id)
    if (deleted.affected === 0) {
      throw new NotFoundException(`Task ${id} Not Found !`)
    }
    return 'Task Deleted'
  }
}
