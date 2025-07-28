import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap')

  app.setGlobalPrefix('api')
  
  //app.enableCors();
  app.enableCors({
    //origin: ['http://localhost:5173','http://localhost:5174'],
    //methods: 'GET,PUT,PATCH,POST,DELETE', //HEAD
    credentials: true, // Permite las cookies
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    //forbidNonWhitelisted: true,
    transform:true,
    // transformOptions:{  
    //   enableImplicitConversion: true,
    // }
  })); 

  const config = new DocumentBuilder()
    .setTitle('Transactions RESTFul API')
    .setDescription('Transactions endpoints')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);  
  SwaggerModule.setup('api', app, documentFactory);

  const configService = app.get(ConfigService)
 
  const PORT = configService.get<number>('port')
  
  await app.listen(Number(PORT));
  
  logger.log(`App runing on port ${PORT}`)

}
bootstrap();
