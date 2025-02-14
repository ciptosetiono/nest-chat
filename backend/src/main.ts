import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //setting cors
  app.enableCors({
    origin: 'http://localhost:3000', // Sesuaikan dengan frontend kamu
    credentials: true, // Jika menggunakan cookies atau auth token
  });

  //global validation pipe
  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true,
      transform: true
    },
  ));
  await app.listen(process.env.PORT ?? 3030);
}
bootstrap();
