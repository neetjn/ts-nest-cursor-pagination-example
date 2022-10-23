import { SliceArray } from 'slice';
import { Injectable } from '@nestjs/common';
import * as Constants from './constants';
import * as SeedData from './data/todos.json';

const Data = SliceArray(...SeedData);

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
  next: string;
}

export const defaultCursorRequest = {
  count: Constants.DEFAULT_PAGE_SIZE,
  start: 0,
};

export const deserializeCursor = (parameters: string): ICursor => {
  const payload: string = Buffer.from(parameters, 'base64').toString('utf8');
  return JSON.parse(payload);
};

const serializeCursor = (cursor: ICursor) => new Buffer(JSON.stringify(cursor), 'utf8').toString('base64');

export const generateCursor = (request: ICursorRequest = defaultCursorRequest, resourceUri: string = null): string => {
  const { start, count, total } = request;

  const isNext = !!resourceUri && !!(total - (start + count));
  const isPrevious = !!resourceUri && !!start;

  const nextPage = isNext ? start + count : null;
  const previousPage = isPrevious ? start - count : null;

  const next = nextPage ? `${resourceUri}?cursor=${generateCursor({
    ...defaultCursorRequest,
    start: nextPage,
    total,
  })}` : null;

  const previous = previousPage ? `${resourceUri}?cursor=${generateCursor({
    ...defaultCursorRequest,
    start: previousPage,
    total,
  })}` : null;

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
  getTodoSize(): number {
    return Data.length;
  }
  getTodo(id: string): ITodo {
    return Data.find(({ id: identifier }) => identifier === id)
  }
  getTodoCollection(cursorStr: string): ITodoCollection {
    const cursor: ICursor = deserializeCursor(cursorStr);
    const { start, count } = cursor;
    const total = Data.length;
    const items = Data.slice(start, start + count);
    const next = generateCursor({
      start: start + count,
      count,
      total,
    });
    const collection: ITodoCollection = {
      items,
      total,
      count,
      next,
    }
    return collection;
  }
}
