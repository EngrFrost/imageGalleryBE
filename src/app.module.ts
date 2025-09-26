import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ImageModule } from './image.module';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { CloudinaryModule } from './cloudinary.module';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UserModule,
    AuthModule,
    ImageModule,
    CloudinaryModule,
  ],
  controllers: [AppController, ImageController],
  providers: [AppService, ImageService, CloudinaryService],
})
export class AppModule {}
