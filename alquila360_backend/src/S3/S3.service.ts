// src/s3/s3.service.ts

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';

import { ConfigService } from '@nestjs/config'; 

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;
  private bucketRegion: string;

  constructor(private configService: ConfigService) {
    /*
    

    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
    const region = this.configService.get<string>('AWS_REGION');
    const bucket = this.configService.get<string>('AWS_S3_BUCKET_NAME');

    if (!accessKeyId || !secretAccessKey || !region || !bucket) {
        // Lanza un error si faltan credenciales críticas
        throw new InternalServerErrorException(
            'Faltan variables de entorno críticas de AWS S3.'
        );
    }
    
    this.bucketRegion = region;
    this.bucketName = bucket;

    // Inicialización del cliente S3
    this.s3Client = new S3Client({
      region: region, // Ahora sabemos que 'region' es string
      credentials: {
        accessKeyId: accessKeyId,       // Ahora sabemos que es string
        secretAccessKey: secretAccessKey, // Ahora sabemos que es string
      },
    });
  }
  



  // Método principal para subir un archivo
  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const key = `${folder}/${Date.now()}-${file.originalname}`;

    const uploadParams = {
      Bucket: this.bucketName,
      Key: key, // Ruta del archivo en S3: "propiedades/123456-nombre.jpg"
      Body: file.buffer, // El contenido del archivo
      ContentType: file.mimetype,
      ACL: ObjectCannedACL.public_read, // Para que la imagen sea accesible por URL
    };

    try {
      const command = new PutObjectCommand(uploadParams);
      await this.s3Client.send(command);
      
      // Construimos la URL pública de S3
      const fileUrl = `https://${this.bucketName}.s3.${this.bucketRegion}.amazonaws.com/${key}`;
      return fileUrl;

    } catch (error) {
      console.error('Error al subir a S3:', error);
      throw new InternalServerErrorException('Error al subir la imagen a la nube.');
    }
      */
  }
    
}