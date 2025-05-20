import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { ValidationPipe } from "@nestjs/common"
import * as process from "node:process"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.API_URL
        : process.env.CLIENT_URL
  })
  app.setGlobalPrefix("api")

  const config = new DocumentBuilder()
    .setTitle("Weather")
    .setDescription("Server side Weather application")
    .setVersion("0.0.0")
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("/api/docs", app, document)

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  )

  await app.listen(process.env.API_PORT ?? 3000)
}

bootstrap()
