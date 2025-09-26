import { Injectable, Logger } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from '../../prisma/prisma.service';

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly prisma: PrismaService,
  ) {}

  async uploadImage(file: MulterFile, userId: string) {
    const uploadResult = await this.cloudinaryService.uploadImage(file);
    console.log(uploadResult);

    this.logger.log(uploadResult);
    const tags = (uploadResult.tags ?? []).slice(0, 10);

    const colors =
      uploadResult.predominant?.google?.map((color) => color[0]).slice(0, 3) ??
      [];
    const description =
      uploadResult.info?.detection?.captioning?.data?.caption ?? null;

    const image = await this.prisma.image.create({
      data: {
        publicId: uploadResult.public_id,
        secureUrl: uploadResult.secure_url,
        userId: userId,
        metadata: {
          create: {
            tags,
            colors,
            description,
            aiProcessingStatus: 'completed',
          },
        },
      },
      include: {
        metadata: true,
      },
    });

    return image;
  }
}
