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

export interface ITodo {
  id: string;
  name: string;
  description: string;
  completed: boolean;
}

export interface ITodoCollection {
  items: Array<ITodo>;
  total: number;
  count: number;
}

const defaultCursorRequest = {
  count: Constants.DEFAULT_PAGE_SIZE,
  start: 0,
};

export const deserializeCursor = (parameters: string): ICursor => {
  const payload: string = Buffer.from(parameters, 'base64').toString('utf8');
  return JSON.parse(payload);
};

const serializeCursor = (cursor: ICursor) => new Buffer(JSON.stringify(cursor), 'utf8').toString('base64');

// TODO: memoize this
export const generateCursor = (resourceUri: string, request: ICursorRequest = defaultCursorRequest): string => {
  console.log(`\nCreating Cursor... Resource=${resourceUri}\n`)
  const { start, count, total } = request;

  const isNext = total - (start + count);
  const isPrevious = !!start;

  const nextPage = isNext ? start + count : null;
  const previousPage = isPrevious ? start - count : null;

  const next = nextPage ? `${resourceUri}?cursor=${generateCursor(
    resourceUri, {
      ...defaultCursorRequest,
      start: nextPage,
    }
  )}` : null;
  const previous = previousPage ? `${resourceUri}?cursor=${generateCursor(
    resourceUri, {
      ...defaultCursorRequest,
      start: previousPage,
    }
  )}` : null;

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
  getTodo(id: string): ITodo {
    return Data.find(({ id: identifier }) => identifier === id)
  }
  getTodoCollection(cursorStr: string): ITodoCollection {
    const cursor: ICursor = deserializeCursor(cursorStr);
    const { start, count } = cursor;
    const items = Data.slice(start, count);
    const total = Data.length;
    const collection: ITodoCollection = {
      items,
      total,
      count,
    }
    return collection;
  }
}
