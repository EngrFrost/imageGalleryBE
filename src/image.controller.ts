import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard.js';
import { ImageService } from './image.service.js';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @UploadedFile() file: any,
    @Request() req: { user: { userId: string } },
  ) {
    return this.imageService.uploadImage(file, req.user.userId);
  }
}
