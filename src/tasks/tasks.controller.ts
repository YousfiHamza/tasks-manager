import { CreateTaskDto } from './dto/create-task.dto'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { Task } from './task.model'
import { TasksService } from './tasks.service'
import { UpdateTaskDto } from './dto/update-todo.dto'
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'

@Controller('tasks')
export class TasksController {
    constructor(private taskService: TasksService) {}

    @Get()
    getTasks(@Query() getTasksFilterDto: GetTasksFilterDto): Task[] {
        if (Object.keys(getTasksFilterDto).length) {
            return this.taskService.getFilteredTasks(getTasksFilterDto)
        } else {
            return this.taskService.getAllTasks()
        }
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string): Task {
        return this.taskService.getTaskById(id)
    }

    @Post()
    createTask(@Body() createTaskDto: CreateTaskDto): Task {
        return this.taskService.createTask(createTaskDto)
    }

    @Patch()
    updateTask(@Body() updateTaskDto: UpdateTaskDto): Task {
        return this.taskService.updateTask(updateTaskDto)
    }

    @Delete('/:id')
    deleteTask(@Param('id') id: string): string {
        return this.taskService.deleteTask(id)
    }
}
