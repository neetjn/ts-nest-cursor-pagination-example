import {
  Controller,
  Get,
  UseInterceptors,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { NotFoundInterceptor } from './interceptors';
import {
  AppService,
  ITodo,
  ITodoCollection,
  generateCursor,
} from './app.service';
import { API_ROOT } from './constants';

export const Routes = {
  Todo: '/api/v1/todo/:id',
  TodoCollection: '/api/v1/todo',
};


const TodoCollectionPath = `${API_ROOT}${Routes.TodoCollection}`;

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(Routes.Todo)
  @UseInterceptors(NotFoundInterceptor)
  getTodo(@Param() params): ITodo {
    return this.appService.getTodo(params.id);
  }

  @Get(Routes.TodoCollection)
  getTodoCollection(@Query() query, @Res() res): ITodoCollection {
    let { cursor } = query;
    if (!cursor) {
      cursor = generateCursor(TodoCollectionPath);
      console.log(`\nCursor Generated: ${cursor}\n`)
      res.redirect(`${TodoCollectionPath}?cursor=${cursor}`);
      return;
    }
    return this.appService.getTodoCollection(cursor);
  }
}
