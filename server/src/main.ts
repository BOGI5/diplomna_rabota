import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.use(cookieParser());
  app.enableCors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "Set-Cookie",
      "Cookie",
    ],
    credentials: true,
  });
  await app.listen(process.env.PORT);
}
bootstrap();
