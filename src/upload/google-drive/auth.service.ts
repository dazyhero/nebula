import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, Auth } from 'googleapis';

@Injectable()
export class AuthService implements OnModuleInit {
  private authClient!: Auth.GoogleAuth;
  private readonly logger = new Logger(AuthService.name, { timestamp: true });

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.logger.log('Initializing Google Drive Auth');

    const scopes = this.configService.get<string>('GOOGLE_SCOPES');

    if (!scopes) {
      this.logger.error('Google Drive scopes not set');
      throw new Error('Google Drive scopes not set');
    }

    this.authClient = new google.auth.GoogleAuth({
      keyFile: this.configService.get<string>('GOOGLE_SERVICE_ACCOUNT_PATH'),
      scopes: scopes.split(','),
    });
  }

  getAuthClient(): Auth.GoogleAuth {
    return this.authClient;
  }

  async getDriveInstance() {
    const auth = await this.authClient.getClient();
    return google.drive({ version: 'v3', auth: auth as Auth.OAuth2Client });
  }
}
