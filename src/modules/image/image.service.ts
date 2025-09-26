import { Injectable, Logger } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ImageFilterDto } from './image.dto';

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly prisma: PrismaService,
  ) {}

  async uploadImages(files: Array<Express.Multer.File>, userId: string) {
    const uploadResults = await Promise.all(
      files.map((file) => this.cloudinaryService.uploadImage(file)),
    );

    this.logger.log(`${uploadResults.length} files uploaded to Cloudinary.`);

    const imageCreationPromises = uploadResults.map((uploadResult) => {
      const tags = (uploadResult.tags ?? []).slice(0, 10);
      const colors =
        uploadResult.predominant?.google
          ?.map((color) => color[0].toLowerCase()) // Store colors in lowercase
          .slice(0, 3) ?? [];
      const description =
        uploadResult.info?.detection?.captioning?.data?.caption ?? null;

      return this.prisma.image.create({
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
    });

    return this.prisma.$transaction(imageCreationPromises);
  }

  async getImagesByUserId(userId: string, options: ImageFilterDto) {
    const { limit = 12, offset = 0, color, page } = options;

    const where: {
      userId: string;
      metadata?: { colors: { has: string } };
    } = { userId };
    if (color) {
      where.metadata = {
        colors: {
          has: color.toLowerCase(),
        },
      };
    }

    const [images, total] = await this.prisma.$transaction([
      this.prisma.image.findMany({
        where,
        skip: offset,
        take: limit,
        include: {
          metadata: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.image.count({
        where,
      }),
    ]);

    return {
      items: images,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
