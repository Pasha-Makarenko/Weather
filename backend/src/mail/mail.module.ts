import { Module } from "@nestjs/common"
import { MailService } from "./mail.service"
import { MailerModule } from "@nestjs-modules/mailer"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { getMailConfig } from "../config/mail.config"

@Module({
  providers: [MailService],
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getMailConfig,
      inject: [ConfigService]
    })
  ],
  exports: [MailService]
})
export class MailModule {}
