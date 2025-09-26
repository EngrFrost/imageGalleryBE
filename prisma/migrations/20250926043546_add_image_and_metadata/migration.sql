-- CreateTable
CREATE TABLE "public"."images" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "secureUrl" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."image_metadata" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT[],
    "colors" TEXT[],
    "aiProcessingStatus" TEXT NOT NULL DEFAULT 'pending',
    "imageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "image_metadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "image_metadata_imageId_key" ON "public"."image_metadata"("imageId");

-- AddForeignKey
ALTER TABLE "public"."images" ADD CONSTRAINT "images_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."image_metadata" ADD CONSTRAINT "image_metadata_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "public"."images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
