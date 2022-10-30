import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as Data from './data/todos.json';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('todo', () => {
    it('should not find todo', () => {
      const id = 'foobar';
      const res = appController.getTodo({
        id,
      });
      expect(res).toEqual(undefined);
    });
    it('Should find existing todo', () => {
      const id = 'a38f6022-7441-4d43-a206-48b314bd7445';
      const res = appController.getTodo({
        id,
      });
      const found = Data.find(({ id: tid }) => tid === id);
      expect(res).toEqual(found);
    });
    it('should get collection of todo and provide default cursor', () => {
      const redirect = jest.fn();
      let statusCode;
      const send = jest.fn();
      const status = code => {
        statusCode = code;
        return {
          send,
        };
      };
      const res = {
        redirect,
        status,
      };
      const _ = appController.getTodoCollection({}, res);
      expect(res.redirect).toHaveBeenCalled();
      expect(statusCode).toBeUndefined();
      const [href] = res.redirect.mock.calls[0] as Array<string>;
      const [,cursor] = href.split('?cursor=');
      redirect.mockReset();
      const collection = appController.getTodoCollection({
        cursor,
      }, res);
      expect(redirect).not.toHaveBeenCalled();
      expect(statusCode).toEqual(200);
      expect(send).toHaveBeenCalledWith(collection);
      expect(collection.items.length).toEqual(collection.count);
      expect(collection.total).toEqual(Data.length);
    });
  });
});
