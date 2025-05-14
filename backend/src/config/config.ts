import { ConfigModuleOptions } from "@nestjs/config"

export const config: ConfigModuleOptions = {
  envFilePath: `.env.${process.env.NODE_ENV}`,
  isGlobal: true
}
