require('dotenv').config();//instatiate environment variables

interface ConfigType {
  app: string;
  port: string;
  db_host?: string;
  db_port: string;
  db_name: string;
  db_user: string;
  db_password?: string;
  jwt_encryption: string;
  rjwt_encryption: string;
  jwt_expiration: string;
  rjwt_expiration: string;
  smtp_host: string;
  smtp_port: string;
  smtp_protocol: string;
  smtp_user: string;
  smtp_password: string;
  reset_host: string;
  email_from: string;
  cloudinary_folder: string;
  cloudinary_path: string;
  bee_plugin_client_id: string,
  bee_plugin_client_secret: string
}

const CONFIG: ConfigType = {
  app: process.env.APP || 'development',
  db_host: process.env.DB_HOST,
  db_name: process.env.DB_NAME || 'db_name',
  db_password: process.env.DB_PASSWORD,
  db_port: process.env.DB_PORT || '5432',
  db_user: process.env.DB_USER || 'db_user',
  jwt_encryption: process.env.JWT_ENCRYPTION || 'jwt_please_change',
  rjwt_encryption: process.env.JWT_ENCRYPTION || 'rjwt_please_change',
  jwt_expiration: process.env.JWT_EXPIRATION || '10000',
  rjwt_expiration: process.env.RJWT_EXPIRATION || '10000',
  port: process.env.PORT || '8080',
  smtp_host: process.env.SMTP_HOST || '',
  smtp_port: process.env.SMTP_PORT || '',
  smtp_protocol: process.env.SMTP_PROTOCOL || '',
  smtp_user: process.env.SMTP_USER || '',
  smtp_password: process.env.SMTP_PASSWORD || '',
  reset_host: process.env.RESET_HOST || '',
  email_from: process.env.EMAIL_FROM || '',
  cloudinary_folder: process.env.CLOUDINARY_FOLDER || '',
  cloudinary_path: process.env.CLOUDINARY_PATH || '',
  bee_plugin_client_id: process.env.BEE_PLUGIN_CLIENT_ID || '',
  bee_plugin_client_secret: process.env.BEE_PLUGIN_CLIENT_SECRET || ''
};

export default CONFIG;
