import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';

export const PG_CONNECTION = 'PG_CONNECTION';

const databaseProvider = {
  provide: PG_CONNECTION,
  useFactory: (): Pool => {
    // Configuración optimizada para Vercel Serverless con Supabase
    const poolConfig = {
      // Usar DATABASE_URL si está disponible (recomendado)
      connectionString: process.env.DATABASE_URL,
      
      // SSL siempre habilitado para Supabase
      ssl: { rejectUnauthorized: false },
      
      // Configuración para connection pooling serial (serverless)
      max: 1, // Una conexión por instancia serverless
      min: 0, // Sin conexiones mínimas
      idleTimeoutMillis: 10000, // Cerrar conexiones idle rápido
      connectionTimeoutMillis: 10000, // Timeout generoso
      allowExitOnIdle: true, // Permitir que el proceso termine si no hay conexiones activas
    };

    // Si no hay DATABASE_URL, construir desde variables individuales
    if (!process.env.DATABASE_URL) {
      delete poolConfig.connectionString;
      Object.assign(poolConfig, {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      });
    }

    const pool = new Pool(poolConfig);

    // Manejo de errores del pool
    pool.on('error', (err) => {
      console.error('❌ Error inesperado en el pool de conexiones:', err);
    });

    // Log de conexión exitosa
    pool.on('connect', () => {
      console.log('✅ Conexión a la base de datos establecida');
    });

    return pool;
  },
};

@Global()
@Module({
  providers: [databaseProvider],
  exports: [PG_CONNECTION],
})
export class DatabaseModule {}

