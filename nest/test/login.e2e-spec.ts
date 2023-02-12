import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { randomUUID } from 'crypto';

describe('Registration and login (e2e)', () => {
  const gqlEndpoint = '/graphql';

  let app: INestApplication;

  const userEmail = randomUUID() + '@email.com',
    userPassword = '1';

  let registerToken = '',
    loginToken = '';

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

  it('Register new user with: password did not match', async () => {
    const email = randomUUID() + '@email.com',
      password = '1',
      repeatPassword = '2';

    await request(app.getHttpServer())
      .post(gqlEndpoint)
      .set({
        token: 'asd',
      })
      .send({
        query: `mutation {
          register(
            input: {
              email: "${email}",
              password: "${password}",
              repeatPassword: "${repeatPassword}",
            }
          )
        }`,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeNull();
        expect(res.body.errors).toBeDefined();
        expect(Array.isArray(res.body.errors)).toBeTruthy();
      });
  });

  it('Login unknown user', async () => {
    const email = randomUUID() + '@email.com',
      password = '1';

    await request(app.getHttpServer())
      .post(gqlEndpoint)
      .send({
        query: `mutation {
          login(
            input: {
              email: "${email}",
              password: "${password}",
            }
          )
        }`,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeNull();
        expect(res.body.errors).toBeDefined();
        expect(Array.isArray(res.body.errors)).toBeTruthy();
      });
  });

  it('Register new user all fine', async () => {
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
        registerToken = res.body.data.register;
      });
  });

  it('Register second time', async () => {
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
        expect(res.body.data).toBeNull();
        expect(res.body.errors).toBeDefined();
        expect(Array.isArray(res.body.errors)).toBeTruthy();
      });
  });

  it('Login user all fine', async () => {
    await request(app.getHttpServer())
      .post(gqlEndpoint)
      .send({
        query: `mutation {
        login(
          input: {
            email: "${userEmail}",
            password: "${userPassword}",
          }
        )
      }`,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.errors).toBeUndefined();
        expect(res.body.data.login).toBeDefined();
        loginToken = res.body.data.login;
      });
  });

  it('Register when logged in by register token', async () => {
    await request(app.getHttpServer())
      .post(gqlEndpoint)
      .set({
        token: registerToken,
      })
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
        expect(res.body.data).toBeNull();
        expect(res.body.errors).toBeDefined();
        expect(Array.isArray(res.body.errors)).toBeTruthy();
      });
  });

  it('Register when logged in by login token', async () => {
    await request(app.getHttpServer())
      .post(gqlEndpoint)
      .set({
        token: loginToken,
      })
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
        expect(res.body.data).toBeNull();
        expect(res.body.errors).toBeDefined();
        expect(Array.isArray(res.body.errors)).toBeTruthy();
      });
  });

  it('Login when logged in by register token', async () => {
    await request(app.getHttpServer())
      .post(gqlEndpoint)
      .set({
        token: registerToken,
      })
      .send({
        query: `mutation {
        login(
          input: {
            email: "${userEmail}",
            password: "${userPassword}",
          }
        )
      }`,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeNull();
        expect(res.body.errors).toBeDefined();
        expect(Array.isArray(res.body.errors)).toBeTruthy();
      });
  });

  it('Login when logged in by login token', async () => {
    await request(app.getHttpServer())
      .post(gqlEndpoint)
      .set({
        token: loginToken,
      })
      .send({
        query: `mutation {
        login(
          input: {
            email: "${userEmail}",
            password: "${userPassword}",
          }
        )
      }`,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeNull();
        expect(res.body.errors).toBeDefined();
        expect(Array.isArray(res.body.errors)).toBeTruthy();
      });
  });
});
