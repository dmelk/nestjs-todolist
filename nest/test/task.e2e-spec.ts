import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { randomUUID } from 'crypto';
import { TaskStatus } from '../src/task/types/task-status';

describe('Registration and login (e2e)', () => {
  const gqlEndpoint = '/graphql';

  let app: INestApplication;

  const userEmail = randomUUID() + '@email.com',
    userPassword = '1';

  let token = '';

  const taskList: any = [],
    newOnlyTaskList: any = [];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Try to get task list by guest ', async () => {
    await request(app.getHttpServer())
      .post(gqlEndpoint)
      .send({
        query: `query {
          tasks {
            total,
            records {
              id, 
              description,
              status
            }
          }
        }`,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeNull();
        expect(res.body.errors).toBeDefined();
        expect(Array.isArray(res.body.errors)).toBeTruthy();
      });
  });

  it('Try to create task by guest ', async () => {
    await request(app.getHttpServer())
      .post(gqlEndpoint)
      .send({
        query: `mutation {
          createTask (
            input: {
              description: "desc"
            }
          ) {
            id, 
            description,
            status
          }
        }`,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeNull();
        expect(res.body.errors).toBeDefined();
        expect(Array.isArray(res.body.errors)).toBeTruthy();
      });
  });

  it('Try to complete task by guest ', async () => {
    await request(app.getHttpServer())
      .post(gqlEndpoint)
      .send({
        query: `mutation {
          completeTask (
            input: {
              id: "${randomUUID()}"
            }
          ) {
            id, 
            description,
            status
          }
        }`,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeNull();
        expect(res.body.errors).toBeDefined();
        expect(Array.isArray(res.body.errors)).toBeTruthy();
      });
  });

  it('Register new user', async () => {
    await request(app.getHttpServer())
      .post(gqlEndpoint)
      .send({
        query: `mutation {
          register(
            input: {
              email: "${userEmail}",
              password: "${userPassword}",
              repeatPassword: "${userPassword}",
            }
          )
        }`,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.errors).toBeUndefined();
        expect(res.body.data.register).toBeDefined();
        token = res.body.data.register;
      });
  });

  it('Get empty task list', async () => {
    await request(app.getHttpServer())
      .post(gqlEndpoint)
      .set({
        token: token,
      })
      .send({
        query: `query {
        tasks {
          total,
          records {
            id, 
            description,
            status
          }
        }
      }`,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.errors).toBeUndefined();
        expect(res.body.data.tasks).toBeDefined();
        expect(res.body.data.tasks.total).toBe(0);
        expect(res.body.data.tasks.records).toStrictEqual([]);
      });
  });

  it('Create 2 new task', async () => {
    const descriptions = ['desc1', 'desc2'];
    for (const description of descriptions) {
      await request(app.getHttpServer())
        .post(gqlEndpoint)
        .set({
          token: token,
        })
        .send({
          query: `mutation {
            createTask (
              input: {
                description: "${description}"
              }
            ) {
              id, 
              description,
              status
            }
          }`,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.errors).toBeUndefined();
          expect(res.body.data.createTask).toBeDefined();
          expect(res.body.data.createTask.id).toBeDefined();
          expect(res.body.data.createTask.description).toBe(description);
          expect(res.body.data.createTask.status).toBe(TaskStatus.NEW);

          taskList.push({ ...res.body.data.createTask });
        });
    }
    taskList.sort((a, b) => {
      if (a.id === b.id) return 0;
      return a.id < b.id ? -1 : 1;
    });
    newOnlyTaskList.push({ ...taskList[0] });
  });

  it('Get created task list', async () => {
    await request(app.getHttpServer())
      .post(gqlEndpoint)
      .set({
        token: token,
      })
      .send({
        query: `query {
        tasks {
          total,
          records {
            id, 
            description,
            status
          }
        }
      }`,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.errors).toBeUndefined();
        expect(res.body.data.tasks).toBeDefined();
        expect(res.body.data.tasks.total).toBe(2);
        expect(res.body.data.tasks.records).toStrictEqual(taskList);
      });
  });

  it('Get task list, take only 1', async () => {
    await request(app.getHttpServer())
      .post(gqlEndpoint)
      .set({
        token: token,
      })
      .send({
        query: `query {
        tasks (
          take: 1
        ){
          total,
          records {
            id, 
            description,
            status
          }
        }
      }`,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.errors).toBeUndefined();
        expect(res.body.data.tasks).toBeDefined();
        expect(res.body.data.tasks.total).toBe(2);
        expect(res.body.data.tasks.records).toStrictEqual([taskList[0]]);
      });
  });

  it('Get task list, skip 1st', async () => {
    await request(app.getHttpServer())
      .post(gqlEndpoint)
      .set({
        token: token,
      })
      .send({
        query: `query {
        tasks (
          skip: 1
        ){
          total,
          records {
            id, 
            description,
            status
          }
        }
      }`,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.errors).toBeUndefined();
        expect(res.body.data.tasks).toBeDefined();
        expect(res.body.data.tasks.total).toBe(2);
        expect(res.body.data.tasks.records).toStrictEqual([taskList[1]]);
      });
  });

  it('Try to complete unknown task', async () => {
    await request(app.getHttpServer())
      .post(gqlEndpoint)
      .set({
        token: token,
      })
      .send({
        query: `mutation {
          completeTask (
            input: {
              id: "${randomUUID()}"
            }
          ) {
            id, 
            description,
            status
          }
        }`,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeNull();
        expect(res.body.errors).toBeDefined();
        expect(Array.isArray(res.body.errors)).toBeTruthy();
      });
  });

  it('Try to complete not your task', async () => {
    const anotherUser = randomUUID() + '@email.com';
    let anotherToken = '';

    await request(app.getHttpServer())
      .post(gqlEndpoint)
      .send({
        query: `mutation {
          register(
            input: {
              email: "${anotherUser}",
              password: "${userPassword}",
              repeatPassword: "${userPassword}",
            }
          )
        }`,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.errors).toBeUndefined();
        expect(res.body.data.register).toBeDefined();
        anotherToken = res.body.data.register;
      });

    await request(app.getHttpServer())
      .post(gqlEndpoint)
      .set({
        token: anotherToken,
      })
      .send({
        query: `mutation {
          completeTask (
            input: {
              id: "${randomUUID()}"
            }
          ) {
            id, 
            description,
            status
          }
        }`,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeNull();
        expect(res.body.errors).toBeDefined();
        expect(Array.isArray(res.body.errors)).toBeTruthy();
      });
  });

  it('Complete 2nd task', async () => {
    await request(app.getHttpServer())
      .post(gqlEndpoint)
      .set({
        token: token,
      })
      .send({
        query: `mutation {
          completeTask (
            input: {
              id: "${taskList[1].id}"
            }
          ) {
            id, 
            description,
            status
          }
        }`,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.errors).toBeUndefined();
        expect(res.body.data.completeTask).toBeDefined();
        expect(res.body.data.completeTask.id).toBe(taskList[1].id);
        expect(res.body.data.completeTask.description).toBe(
          taskList[1].description,
        );
        expect(res.body.data.completeTask.status).toBe(TaskStatus.DONE);
        taskList[1].status = TaskStatus.DONE;
      });
  });

  it('Get task list without completed task', async () => {
    await request(app.getHttpServer())
      .post(gqlEndpoint)
      .set({
        token: token,
      })
      .send({
        query: `query {
        tasks {
          total,
          records {
            id, 
            description,
            status
          }
        }
      }`,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.errors).toBeUndefined();
        expect(res.body.data.tasks).toBeDefined();
        expect(res.body.data.tasks.total).toBe(1);
        expect(res.body.data.tasks.records).toStrictEqual(newOnlyTaskList);
      });
  });

  it('Get task list with completed task', async () => {
    await request(app.getHttpServer())
      .post(gqlEndpoint)
      .set({
        token: token,
      })
      .send({
        query: `query {
        tasks (all: true) {
          total,
          records {
            id, 
            description,
            status
          }
        }
      }`,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.errors).toBeUndefined();
        expect(res.body.data.tasks).toBeDefined();
        expect(res.body.data.tasks.total).toBe(2);
        expect(res.body.data.tasks.records).toStrictEqual(taskList);
      });
  });
});
