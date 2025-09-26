import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [CloudinaryModule, PrismaModule],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
