import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { CreateTaskDto } from './dto/create-task.dto'
import { Task, TaskStatus } from './task.model'
import { Injectable, NotFoundException } from '@nestjs/common'
import { v4 as uuid } from 'uuid'
import { UpdateTaskDto } from './dto/update-todo.dto'

@Injectable()
export class TasksService {
    private tasks: Task[] = []

    getAllTasks(): Task[] {
        return this.tasks
    }

    getFilteredTasks(filter: GetTasksFilterDto): Task[] {
        const { search, status } = filter
        let myTasks = this.getAllTasks()
        if (search) {
            myTasks = myTasks.filter((task: Task) => {
                if (task.title.includes(search) || task.description.includes(search)) {
                    return true
                }
                return false
            })
        }
        if (status) {
            myTasks = myTasks.filter((task: Task) => task.status === status)
        }
        return myTasks
    }

    getTaskById(id: string): Task {
        const myTask = this.tasks.find((task: Task) => task.id === id)
        if (!myTask) {
            throw new NotFoundException(`Task ${id} not Found !`)
        }
        return myTask
    }

    createTask(createTaskDto: CreateTaskDto): Task {
        const myTask = {
            id: uuid(),
            title: createTaskDto.title,
            description: createTaskDto.description,
            status: TaskStatus.OPEN,
        }
        this.tasks.push(myTask)
        return myTask
    }

    updateTask(updateTaskDto: UpdateTaskDto): Task {
        this.tasks = this.tasks.map((task: Task) => {
            if (task.id === updateTaskDto.id) {
                return updateTaskDto
            }
            return task
        })
        return updateTaskDto
    }

    deleteTask(id: string): string {
        const myTask = this.getTaskById(id)
        this.tasks = this.tasks.filter((task: Task) => task.id !== myTask.id)
        return id
    }
}
