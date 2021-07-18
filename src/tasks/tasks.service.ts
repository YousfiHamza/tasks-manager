import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { CreateTaskDto } from './dto/create-task.dto'
import { TaskStatus } from './task-status.enum'
import { Injectable, NotFoundException } from '@nestjs/common'
import { v4 as uuid } from 'uuid'
import { UpdateTaskDto } from './dto/update-todo.dto'
import { TasksRepository } from './tasks.repository'
import { InjectRepository } from '@nestjs/typeorm'
import { Task } from './task.entity'

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository
  ) {}

  getTasks(filter: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksRepository.getTasks(filter)
  }

  // GET BY ID
  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOne(id)
    if (!found) {
      throw new NotFoundException(`Task ${id} Not Found !`)
    }
    return found
  }

  // POST
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto)
  }

  // UPDATE
  async updateTask(updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.getTaskById(updateTaskDto.id)
    const myTask = await this.tasksRepository.save(updateTaskDto)
    if (!myTask) {
      throw new NotFoundException(`Can't Update ${updateTaskDto.title} !`)
    }
    return myTask
  }

  // DELETE
  async deleteTask(id: string): Promise<string> {
    const deleted = await this.tasksRepository.delete(id)
    if (deleted.affected === 0) {
      throw new NotFoundException(`Task ${id} Not Found !`)
    }
    return 'Task Deleted'
  }
}
