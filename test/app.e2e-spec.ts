import {Test} from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from '../src/bookmark/dto';
import { ChatNextOutputDto } from '../src/chat/dto/chatNextOutput.dto';
import { ChatMessageDto } from '../src/chat/dto';

describe('App e2e', () =>{
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.init();
  await app.listen(3000);

  prisma = app.get(PrismaService);

  await prisma.cleanDb();
  pactum.request.setBaseUrl('http://localhost:3000');
  });

  afterAll(()=>{
    app.close();
  });


  describe('Auth', () =>{
    const dto: AuthDto = {
    email: 'lealtest@gmail.com',
    password: '123',
    }
    describe('Signup', () => {

      it('Should throw if email empty', ()=>{
        return pactum.spec().post('/auth/signup',
        ).withBody({
            password: dto.password
        }).expectStatus(400);
      });

      it('Should throw if password empty', ()=>{
        return pactum.spec().post('/auth/signup',
        ).withBody({
            email: dto.email
        }).expectStatus(400);
      });

      it('Should throw if no body provided', ()=>{
        return pactum.spec().post('/auth/signup',
        ).expectStatus(400);
      });


      it('Should Signup', ()=>{
        return pactum.spec().post('/auth/signup',
        ).withBody(dto).expectStatus(201);
      });

    });

    describe('Signin', () => {

      it('Should throw if email empty', ()=>{
        return pactum.spec().post('/auth/signin',
        ).withBody({
            password: dto.password
        }).expectStatus(400);
      });

      it('Should throw if password empty', ()=>{
        return pactum.spec().post('/auth/signin',
        ).withBody({
            email: dto.email
        }).expectStatus(400);
      });

      it('Should throw if no body provided', ()=>{
        return pactum.spec().post('/auth/signin',
        ).expectStatus(400);
      });

      it('should Signin', ()=>{
        return pactum.spec().post('/auth/signin',
        ).withBody(dto).expectStatus(200).stores('userAt','access_token');
      });
    });
  });

  
  describe('User', () =>{
    describe('Get me', () => {
      it('Should get current user', () =>{

        return pactum.spec().get('/users/me',
        ).withHeaders({
          Authorization: 'Bearer $S{userAt}',
        }).expectStatus(200);
      });
    });

    describe('Edit user', () => {
      it('Should edit user', () =>{
        const dto: EditUserDto = {
          firstName: "Lucas",
          email: "LLealL@gmail.com",
        };
        return pactum.spec().patch('/users',
        ).withHeaders({
          Authorization: 'Bearer $S{userAt}',
        }).withBody(dto).expectStatus(200)
        .expectBodyContains(dto.firstName)
        .expectBodyContains(dto.email);
      });
    });
  });

  
  describe('Bookmarks', () =>{
    describe('Get empty bookmarks', () => {
      it('Should get bookmarks', () => {
        return pactum.spec().get('/bookmarks',
        ).withHeaders({
          Authorization: 'Bearer $S{userAt}',
        }).expectStatus(200).expectBody([]);
      });

    });

    describe('Create bookmark', () => {
      const dto: CreateBookmarkDto = {
        title: 'First Bookmark',
        link: 'https://www.youtube.com/watch?v=GHTA143_b-s',
      };
      it('Should create bookmark', () => {
        return pactum.spec().post('/bookmarks',
        ).withHeaders({
          Authorization: 'Bearer $S{userAt}',
        }).withBody(dto).expectStatus(201).stores('bookmarkId', 'id');
      });
    });

    describe('Get bookmarks', () => {
      it('Should get bookmarks', () => {
        return pactum.spec().get('/bookmarks',
        ).withHeaders({
          Authorization: 'Bearer $S{userAt}',
        }).expectStatus(200);
      });
    });

    describe('Get bookmark by id', () => {
      it('Should get bookmark by id', () => {
        return pactum.spec().get('/bookmarks/{id}',
        ).withPathParams('id', '$S{bookmarkId}',
        ).withHeaders({
          Authorization: 'Bearer $S{userAt}',
        }).expectStatus(200).expectBodyContains('$S{bookmarkId}');
      });
    });


    describe('Edit bookmark by id', () => {
      const dto: EditBookmarkDto = {
        title: 'Coffee History SECOND EDITION',
        description: 'Coffee Awards 2023',
      };
      it('Should edit bookmark by id', () => {
        return pactum.spec().patch('/bookmarks/{id}',
        ).withPathParams('id', '$S{bookmarkId}',
        ).withHeaders({
          Authorization: 'Bearer $S{userAt}',
        }).withBody(dto).expectStatus(200)
        .expectBodyContains(dto.title)
        .expectBodyContains(dto.description);
      });
    });

    describe('Delete bookmark by id', () => {
      it('Should delete bookmark by id', () => {
        return pactum.spec().delete('/bookmarks/{id}',
        ).withPathParams('id', '$S{bookmarkId}',
        ).withHeaders({
          Authorization: 'Bearer $S{userAt}',
        }).expectStatus(204);

      });
      it('Should get empty bookmarks', () =>{
        return pactum.spec().get('/bookmarks',
        ).withHeaders({
          Authorization: 'Bearer $S{userAt}',
        }).expectStatus(200).expectJsonLength(0);
      });
    });


  });

  describe('Chat', () =>{
    const dto: ChatNextOutputDto = {
      getNextQuestion: true,
      currentIndex: -1,
    }
    describe('Get Question', ()=>{
      it('Should Get First Question', () => {
        return pactum.spec().get('/chat/nextOutput',
        ).withHeaders({
          Authorization: 'Bearer $S{userAt}',
        }).withBody(dto).expectStatus(200).stores('nextQuestion','question');
      })
    });

    describe('Create Context', ()=>{
      const messageDto: ChatMessageDto = {
        question: "$S{nextQuestion}",
        answer: "Hi!",
      }
      it('Should create Context', ()=>{
        return pactum.spec().post('/chat/questionAnswer',
        ).withHeaders({
          Authorization: 'Bearer $S{userAt}',
        }).withBody(messageDto).expectStatus(201);
      });
    });

  });

});