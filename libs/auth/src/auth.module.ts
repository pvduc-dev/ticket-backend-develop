import {
  DynamicModule,
  Module,
  ModuleMetadata,
  Provider,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from '@app/auth/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OtpModule } from '@app/otp';
import { UserRepository } from '@app/auth/user.repository';

interface AuthModuleOptions {
  userRepository: UserRepository;
}

export interface AuthModuleOptionsFactory {
  createAuthModuleOptions(): Promise<AuthModuleOptions> | AuthModuleOptions;
}

interface AuthModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: any;
  inject?: any[];
  useExisting?: any;
  useClass?: any;
}

@Module({})
export class AuthModule {
  static registerAsync(options: AuthModuleAsyncOptions): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
          useFactory: (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: {
              expiresIn: configService.get<string>('JWT_EXPIRES'),
            },
          }),
          inject: [ConfigService],
        }),
        OtpModule,
        ...options.imports,
      ],
      providers: [
        ...this.createAsyncProviders(options),
        AuthService,
        JwtStrategy,
      ],
      exports: [AuthService, JwtStrategy],
    };
  }

  public static createAsyncProviders(
    options: AuthModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  public static createAsyncOptionsProvider(
    options: AuthModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: 'UserRepository',
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      provide: 'UserRepository',
      useFactory: async (
        optionsFactory: AuthModuleOptionsFactory,
      ): Promise<AuthModuleOptions> => {
        return optionsFactory.createAuthModuleOptions();
      },
      inject: [options.useExisting || options.useClass],
    };
  }
}
