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
    const { limit = 12, offset = 0, color, search, similarTo, page } = options;

    const where: any = { userId };
    const metadataConditions: any[] = [];

    // Color filter
    if (color) {
      metadataConditions.push({
        colors: {
          has: color.toLowerCase(),
        },
      });
    }

    // Text search (search in tags and description)
    if (search) {
      const searchLower = search.toLowerCase();
      metadataConditions.push({
        OR: [
          {
            tags: {
              hasSome: searchLower.split(' '),
            },
          },
          {
            tags: {
              has: searchLower,
            },
          },
          {
            description: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      });
    }

    // Similar image search (find images with overlapping colors/tags)
    if (similarTo) {
      const sourceImage = await this.prisma.image.findFirst({
        where: { id: similarTo, userId },
        include: { metadata: true },
      });

      if (sourceImage?.metadata) {
        metadataConditions.push({
          OR: [
            {
              colors: {
                hasSome: sourceImage.metadata.colors,
              },
            },
            {
              tags: {
                hasSome: sourceImage.metadata.tags,
              },
            },
          ],
        });
        // Exclude the source image itself
        where.id = { not: similarTo };
      }
    }

    if (metadataConditions.length > 0) {
      where.metadata = {
        AND: metadataConditions,
      };
    }

    const offsetComputed = (page - 1) * limit;

    const [images, total] = await this.prisma.$transaction([
      this.prisma.image.findMany({
        where,
        skip: offsetComputed,
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
