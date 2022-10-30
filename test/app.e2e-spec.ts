import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Routes } from './../src/app.controller';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it(`GET ${Routes.Todo} - invalid id`, () => {
    return request(app.getHttpServer())
      .get(Routes.Todo)
      .expect(404);
  });

  it(`GET ${Routes.Todo} - valid id`, () => {
    const id = 'a38f6022-7441-4d43-a206-48b314bd7445';
    const href = Routes.Todo.replace(':id', id);
    return request(app.getHttpServer())
      .get(href)
      .expect(200);
  });
});
