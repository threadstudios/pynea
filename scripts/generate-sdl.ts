import { NestFactory } from '@nestjs/core';
import {
  GraphQLSchemaBuilderModule,
  GraphQLSchemaFactory,
} from '@nestjs/graphql';
import * as fs from 'fs';
import { printSchema } from 'graphql';
import { UsersResolver } from '../src/users/resolver/users.resolver';

async function generateSchema() {
  const app = await NestFactory.create(GraphQLSchemaBuilderModule);
  await app.init();

  const gqlSchemaFactory = app.get(GraphQLSchemaFactory);
  const schema = await gqlSchemaFactory.create([UsersResolver], {
    numberScalarMode: 'integer',
  });
  await fs.writeFileSync(
    `${process.cwd()}/artifacts/schema.gql`,
    printSchema(schema),
    'utf-8',
  );
}

generateSchema();
