import { Injectable } from '@nestjs/common';
import * as Constants from './constants';
import * as Data from './data/todos.json';

interface ICursorLinks {
  next: string;
  previous: string;
}

interface ICursor {
  start: number;
  count: number;
  links: ICursorLinks;
}

interface ICursorRequest {
  count?: number;
  start?: number;
  total?: number;
}

interface ITodo {
  id: string;
  name: string;
  description: string;
  completed: boolean;
}

const defaultCursorRequest = {
  count: Constants.DEFAULT_PAGE_SIZE,
  start: 0,
};

const deserializeCursor = (parameters: string): ICursor => {
  const payload: string = Buffer.from(parameters, 'base64').toString('utf8');
  return JSON.parse(payload);
};

const serializeCursor = (cursor: ICursor) => new Buffer(JSON.stringify(cursor), 'utf8').toString('base64');

const generateCursor = (resourceUri: string, request: ICursorRequest = defaultCursorRequest): string => {
  const { start, count, total } = request;

  const isNext = total - (start + count);
  const isPrevious = !!start;

  const nextPage = isNext ? start + count : null;
  const previousPage = isPrevious ? start - count : null;

  const next = nextPage ? `${resourceUri}?cursor=${}` : null;
  const previous = previousPage ? `${resourceUri}?cursor=${}` : null;

  const cursor: ICursor = {
    start,
    count,
    links: {
      next,
      previous,
    },
  };

  return serializeCursor(cursor);
};

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getTodos(cursor): Array<ITodo> {
    return Data;
  }
}
