import { NotFoundException } from '@nestjs/common'
import { TaskStatus } from './task-status.enum'
import { TasksRepository } from './tasks.repository'
import { Test } from '@nestjs/testing'
import { TasksService } from './tasks.service'
import { User } from '../auth/user.entity'

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
})

const mockUser: User = { id: '69', username: 'username', password: 'password', tasks: [] }

const mockTask = {
  title: 'Testing Title',
  description: 'Testing description',
  id: '69',
  status: TaskStatus.OPEN,
}

describe('Task Service', () => {
  let taskService: TasksService
  let tasksRepository: any

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [TasksService, { provide: TasksRepository, useFactory: mockTasksRepository }],
    }).compile()

    taskService = module.get(TasksService)
    tasksRepository = module.get(TasksRepository)
  })

  describe('Get Tasks', () => {
    it('calls TaskRepo.getTasks and returns the result', async () => {
      expect(tasksRepository.getTasks).not.toHaveBeenCalled()
      tasksRepository.getTasks.mockResolvedValue('All Tasks')
      const result = await taskService.getTasks(null, mockUser)
      expect(tasksRepository.getTasks).toHaveBeenCalledTimes(1)
      expect(result).toEqual('All Tasks')
    })
  })

  describe('Get Tasks By ID', () => {
    // Return Result
    it('calls TaskRepo.findOne and returns the result', async () => {
      expect(tasksRepository.findOne).not.toHaveBeenCalled()
      tasksRepository.findOne.mockResolvedValue(mockTask)
      const result = await taskService.getTaskById(null, mockUser)
      expect(tasksRepository.findOne).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockTask)
    })
    // Throw Error
    it('calls TaskRepo.findOne and thrown Error', () => {
      tasksRepository.findOne.mockResolvedValue(null)
      expect(taskService.getTaskById('69', mockUser)).rejects.toThrow('Task 69 Not Found !')
    })
  })
})
