import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';

export const PG_CONNECTION = 'PG_CONNECTION';

const databaseProvider = {
  provide: PG_CONNECTION,
  useFactory: (): Pool => {
    const pool = new Pool({
      // Connection string (URL completa de la base de datos)
      connectionString: process.env.DATABASE_URL,
      
      // Configuración de SSL (requerido por Supabase)
      ssl: {
        rejectUnauthorized: false,
      },
      
      // Connection pooling optimizado para serverless con Supabase
      max: 10, // Máximo de conexiones en el pool
      min: 2, // Mínimo de conexiones activas
      idleTimeoutMillis: 10000, // Cerrar conexiones inactivas después de 10s
      connectionTimeoutMillis: 5000, // Timeout para establecer conexión
      allowExitOnIdle: true, // Permite que el proceso termine si todas las conexiones están inactivas
    });

    // Manejo de errores del pool
    pool.on('error', (err) => {
      console.error('❌ Error inesperado en el pool de conexiones:', err);
    });

    // Log cuando se conecta (útil para debugging)
    pool.on('connect', () => {
      console.log('✅ Nueva conexión establecida en el pool de Supabase');
    });

    // Log cuando se remueve una conexión
    pool.on('remove', () => {
      console.log('🔄 Conexión removida del pool');
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

