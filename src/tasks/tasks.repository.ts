import { GetTasksFilterDto } from './dto/get-tasks-filter.dto'
import { EntityRepository, Repository } from 'typeorm'
import { CreateTaskDto } from './dto/create-task.dto'
import { TaskStatus } from './task-status.enum'
import { Task } from './task.entity'

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        const { search, status } = filterDto
        const query = this.createQueryBuilder('task')

        if (status) {
            query.andWhere('task.status = :status', { status })
        }
        if (search) {
            query.andWhere(
                // sql syntax - lower for case insensitive searching
                'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
                // the % is for anything before or after the search key word
                { search: `%${search}%` }
            )
        }

        const tasks = await query.getMany()
        return tasks
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description } = createTaskDto
        const myTask = this.create({
            title,
            description,
            status: TaskStatus.OPEN,
        })

        await this.save(myTask)
        return myTask
    }
}
