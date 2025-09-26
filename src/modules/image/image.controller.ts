import {
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Request,
  Query,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ImageFilterDto } from './image.dto';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getImages(
    @Request() req: { user: { userId: string } },
    @Query() query: ImageFilterDto,
  ) {
    return this.imageService.getImagesByUserId(req.user.userId, query);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images'))
  uploadImages(
    @UploadedFiles()
    files: Array<Express.Multer.File>,
    @Request() req: { user: { userId: string } },
  ) {
    return this.imageService.uploadImages(files, req.user.userId);
  }
}
