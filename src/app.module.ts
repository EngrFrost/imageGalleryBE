import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { ImageModule } from './modules/image/image.module';
import { ImageController } from './modules/image/image.controller';
import { ImageService } from './modules/image/image.service';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { CloudinaryService } from './modules/cloudinary/cloudinary.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UserModule,
    AuthModule,
    ImageModule,
    CloudinaryModule,
  ],
  controllers: [ImageController],
  providers: [ImageService, CloudinaryService],
})
export class AppModule {}
