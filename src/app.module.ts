import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { NegociosModule } from './modules/negocios/negocios.module';
import { CategoriasModule } from './modules/categorias/categorias.module';
import { ProductosModule } from './modules/productos/productos.module';
import { MovimientosModule } from './modules/movimientos/movimientos.module';
import { AhorrosModule } from './modules/ahorros/ahorros.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    UsuariosModule,
    NegociosModule,
    CategoriasModule,
    ProductosModule,
    MovimientosModule,
    AhorrosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
