import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ExecutionResult } from 'graphql';
import { join } from 'path';
import { ErrorInterceptor } from './interceptor/error.interceptor';
import { UsersModule } from './users/users.module';
import { parseError } from './util/parse-error';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '/../../', 'public'),
    }),
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      graphiql: true,
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
      autoSchemaFile: true,
      errorFormatter: (result: ExecutionResult) => parseError(result),
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
  ],
})
export class AppModule {}
