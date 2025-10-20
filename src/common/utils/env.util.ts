export const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  
  if (!value && !defaultValue) {
    throw new Error(`Variable de entorno ${key} no está definida`);
  }
  
  return value || defaultValue!;
};

export const getEnvNumber = (key: string, defaultValue?: number): number => {
  const value = process.env[key];
  
  if (!value && defaultValue === undefined) {
    throw new Error(`Variable de entorno ${key} no está definida`);
  }
  
  return value ? parseInt(value, 10) : defaultValue!;
};

export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

