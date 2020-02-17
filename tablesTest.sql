CREATE TABLE users (
user_id SERIAL PRIMARY KEY,
first_name VARCHAR(255),
last_name VARCHAR(255),
password VARCHAR(255),
email VARCHAR(255),
email_verified boolean default false,
phone VARCHAR(255),
phone_verified boolean default false,
birthday DATE,
gender VARCHAR(255),
notification_email boolean default false,
notification_sms boolean default false,
subscription boolean default false,
created_at timestamp NOT NULL,
updated_at timestamp,
deleted_at timestamp,
referrer integer,
last_session timestamp,
reset_password_token VARCHAR(255)
);

CREATE TABLE devices (
device_id SERIAL PRIMARY KEY,
created_at timestamp NOT NULL,
updated_at timestamp,
deleted_at timestamp,
info jsonb
);
INSERT INTO devices (device_id, created_at) VALUES (1,CURRENT_TIMESTAMP);
select setval('devices_device_id_seq', (select max(device_id) from devices));

CREATE TABLE users_devices (
user_id integer NOT NULL,
device_id integer NOT NULL,
created_at timestamp NOT NULL,
PRIMARY KEY (user_id, device_id),
CONSTRAINT users_devices_device_id_fkey FOREIGN KEY (device_id)
      REFERENCES devices (device_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT users_devices_user_id_fkey FOREIGN KEY (user_id)
      REFERENCES users (user_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE regions (
region_id SERIAL PRIMARY KEY,
created_at timestamp NOT NULL,
updated_at timestamp,
deleted_at timestamp,
country VARCHAR(255),
ip VARCHAR(255) NOT NULL,
region VARCHAR(255),
timezone VARCHAR(255),
city VARCHAR(255),
lt double precision,
lg double precision
);

CREATE TABLE users_regions (
user_id integer NOT NULL,
region_id integer NOT NULL,
created_at timestamp NOT NULL,
PRIMARY KEY (user_id, region_id),
CONSTRAINT users_regions_region_id_fkey FOREIGN KEY (region_id)
      REFERENCES regions (region_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT users_regions_user_id_fkey FOREIGN KEY (user_id)
      REFERENCES users (user_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE roles (
role_id SERIAL PRIMARY KEY,
created_at timestamp NOT NULL,
updated_at timestamp,
deleted_at timestamp,
name VARCHAR(255) UNIQUE NOT NULL
);
INSERT INTO roles (role_id, created_at, name) VALUES (1,CURRENT_TIMESTAMP,'superadmin');
INSERT INTO roles (role_id, created_at, name) VALUES (2,CURRENT_TIMESTAMP,'admin');
select setval('roles_role_id_seq', (select max(role_id) from roles));

CREATE TABLE users_roles (
user_id integer NOT NULL,
role_id integer NOT NULL,
created_at timestamp NOT NULL,
PRIMARY KEY (user_id, role_id),
CONSTRAINT users_roles_role_id_fkey FOREIGN KEY (role_id)
      REFERENCES roles (role_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT users_roles_user_id_fkey FOREIGN KEY (user_id)
      REFERENCES users (user_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE sessions (
sid VARCHAR(255) PRIMARY KEY,
user_id integer NOT NULL,
device_id integer,
expires timestamp,
data jsonb,
created_at timestamp NOT NULL,
updated_at timestamp,
deleted_at timestamp
);

CREATE TABLE apps (
app_id SERIAL PRIMARY KEY,
title VARCHAR(255) NOT NULL unique,
description TEXT,
a_category_id integer NOT NULL,
created_at timestamp NOT NULL,
updated_at timestamp,
deleted_at timestamp
);

CREATE TABLE images (
image_id SERIAL PRIMARY KEY,
path VARCHAR(255) NOT NULL,
title VARCHAR(255),
created_at timestamp NOT NULL,
deleted_at timestamp,
updated_at timestamp
);

CREATE TABLE apps_images (
app_id integer NOT NULL,
image_id integer NOT NULL,
sorting int,
created_at timestamp NOT NULL,
updated_at timestamp,
PRIMARY KEY (app_id, image_id),
CONSTRAINT apps_images_image_id_fkey FOREIGN KEY (image_id)
      REFERENCES images (image_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT apps_images_app_id_fkey FOREIGN KEY (app_id)
      REFERENCES apps (app_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE users_apps (
user_id integer NOT NULL,
app_id integer NOT NULL,
created_at timestamp NOT NULL,
notification_email boolean default false,
notification_sms boolean default false,
updated_at timestamp,
deleted_at timestamp,
subscr_expires timestamp,
PRIMARY KEY (user_id, app_id),
CONSTRAINT users_apps_app_id_fkey FOREIGN KEY (app_id)
      REFERENCES apps (app_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
CONSTRAINT users_apps_user_id_fkey FOREIGN KEY (user_id)
      REFERENCES users (user_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE payments (
payment_id SERIAL PRIMARY KEY,
user_id INTEGER NOT NULL,
title VARCHAR(255) NOT NULL,
info jsonb,
payment double precision not null,
created_at timestamp NOT NULL,
deleted_at timestamp,
updated_at timestamp
);

CREATE TABLE withdraw_methods (
withdraw_method_id SERIAL PRIMARY KEY,
title VARCHAR(255) NOT NULL,
description TEXT,
created_at timestamp NOT NULL,
deleted_at timestamp,
updated_at timestamp
);

CREATE TABLE users_withdraw_methods (
user_id integer NOT NULL,
withdraw_method_id integer NOT NULL,
created_at timestamp NOT NULL,
PRIMARY KEY (user_id, withdraw_method_id),
CONSTRAINT users_withdraw_methods_app_id_fkey FOREIGN KEY (withdraw_method_id)
      REFERENCES withdraw_methods (withdraw_method_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
CONSTRAINT users_withdraw_methods_user_id_fkey FOREIGN KEY (user_id)
      REFERENCES users (user_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE cards (
card_id SERIAL PRIMARY KEY,
user_id integer NOT NULL,
card_holder VARCHAR(255) NOT NULL,
cvv integer NOT NULL,
num bigint NOT NULL,
expires timestamp NOT NULL,
created_at timestamp NOT NULL,
updated_at timestamp,
deleted_at timestamp,
current boolean NOT NULL
);

CREATE TABLE events (
event_id SERIAL PRIMARY KEY,
user_id INTEGER NOT NULL,
title VARCHAR(255) NOT NULL,
app jsonb,
device jsonb,
region jsonb,
info jsonb,
created_at timestamp NOT NULL
);

CREATE TABLE a_categories (
a_category_id SERIAL PRIMARY KEY,
created_at timestamp NOT NULL,
updated_at timestamp,
deleted_at timestamp,
name VARCHAR(255) NOT NULL
);
INSERT INTO a_categories (a_category_id,created_at,name) VALUES (1,CURRENT_TIMESTAMP,'Intertainment');
select setval('a_categories_a_category_id_seq', (select max(a_category_id) from a_categories));

CREATE TABLE requests (
request_id SERIAL PRIMARY KEY,
url VARCHAR(255) NOT NULL,
method VARCHAR(255) NOT NULL,
sid VARCHAR(255),
created_at timestamp without time zone NOT NULL,
app VARCHAR(255),
info jsonb
);

CREATE TABLE crashes (
crash_id SERIAL PRIMARY KEY,
device_id INTEGER NOT NULL,
created_at timestamp NOT NULL,
user_id INTEGER,
info jsonb,
app VARCHAR(255)
);

CREATE TABLE campaigns (
campaign_id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
run_type jsonb NOT NULL,
channel_type smallint NOT NULL,
only_for_subscribed boolean default false,
frequency_cap boolean default false,
start_date timestamp,
end_date timestamp,
conversion jsonb,
created_at timestamp NOT NULL,
updated_at timestamp,
deleted_at timestamp
);

CREATE TABLE segments (
segment_id SERIAL PRIMARY KEY,
name VARCHAR(255),
user_data jsonb,
behavior jsonb,
technology jsonb,
querystring jsonb,
created_at timestamp NOT NULL,
updated_at timestamp,
deleted_at timestamp
);

CREATE TABLE variants (
variant_id SERIAL PRIMARY KEY,
campaign_id integer NOT NULL,
data jsonb,
created_at timestamp NOT NULL,
updated_at timestamp
);

CREATE TABLE android_targets (
android_target_id SERIAL PRIMARY KEY,
app_id  INTEGER NOT NULL,
created_at timestamp NOT NULL,
updated_at timestamp,
deleted_at timestamp
);

CREATE TABLE ios_targets (
ios_target_id SERIAL PRIMARY KEY,
app_id  INTEGER NOT NULL,
created_at timestamp NOT NULL,
updated_at timestamp,
deleted_at timestamp
);

CREATE TABLE campaigns_android_targets (
campaign_id integer NOT NULL,
android_target_id integer NOT NULL,
created_at timestamp NOT NULL,
PRIMARY KEY (campaign_id, android_target_id),
CONSTRAINT campaigns_android_targets_android_target_id_fkey FOREIGN KEY (android_target_id)
      REFERENCES android_targets (android_target_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT campaigns_android_targets_campaign_id_fkey FOREIGN KEY (campaign_id)
      REFERENCES campaigns (campaign_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE campaigns_ios_targets (
campaign_id integer NOT NULL,
ios_target_id integer NOT NULL,
created_at timestamp NOT NULL,
PRIMARY KEY (campaign_id, ios_target_id),
CONSTRAINT campaigns_ios_targets_ios_target_id_fkey FOREIGN KEY (ios_target_id)
      REFERENCES ios_targets (ios_target_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT campaigns_ios_targets_campaign_id_fkey FOREIGN KEY (campaign_id)
      REFERENCES campaigns (campaign_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE campaigns_segments (
campaign_id integer NOT NULL,
segment_id integer NOT NULL,
created_at timestamp NOT NULL,
updated_at timestamp,
include boolean default true,
PRIMARY KEY (campaign_id, segment_id),
CONSTRAINT campaigns_segments_segment_id_fkey FOREIGN KEY (segment_id)
      REFERENCES segments (segment_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT campaigns_segments_campaign_id_fkey FOREIGN KEY (campaign_id)
      REFERENCES campaigns (campaign_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE test_segments (
test_segment_id SERIAL PRIMARY KEY,
name VARCHAR(255),
user_id INTEGER,
property_name VARCHAR(125),
property_values jsonb
);

-- pixart starts
CREATE TABLE pixart_pictures (
picture_id SERIAL PRIMARY KEY,
path VARCHAR(255) NOT NULL,
name VARCHAR(255),
approved boolean,
image_type varchar(125),
category_id INTEGER,
created_at timestamp NOT NULL,
deleted_at timestamp,
updated_at timestamp
);

CREATE TABLE pixart_categories (
category_id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
created_at timestamp NOT NULL,
deleted_at timestamp,
updated_at timestamp
);
INSERT INTO pixart_categories (category_id,created_at,name) VALUES (1,CURRENT_TIMESTAMP,'Others');
select setval('pixart_categories_category_id_seq', (select max(category_id) from pixart_categories));

CREATE TABLE pixart_users_pictures (
user_id integer NOT NULL,
picture_id integer NOT NULL,
info jsonb NOT NULL,
name VARCHAR(255) NOT NULL,
created_at timestamp NOT NULL,
deleted_at timestamp,
updated_at timestamp,
PRIMARY KEY (user_id, picture_id),
CONSTRAINT pixart_users_pictures_picture_id_fkey FOREIGN KEY (picture_id)
      REFERENCES pixart_pictures (picture_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT pixart_users_pictures_user_id_fkey FOREIGN KEY (user_id)
      REFERENCES users (user_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);
-- pixart ends

-- data inserted
INSERT INTO apps (app_id, title, description,a_category_id,created_at) VALUES (1,'app1','some description','1',CURRENT_TIMESTAMP);
INSERT INTO apps (app_id, title, description,a_category_id,created_at) VALUES (2,'app2','some description','1',CURRENT_TIMESTAMP);
INSERT INTO apps (app_id, title, description,a_category_id,created_at) VALUES (3,'app3','some description','1',CURRENT_TIMESTAMP);
INSERT INTO apps (app_id, title, description,a_category_id,created_at) VALUES (4,'app4','some description','1',CURRENT_TIMESTAMP);
INSERT INTO apps (app_id, title, description,a_category_id,created_at) VALUES (5,'app5','some description','1',CURRENT_TIMESTAMP);
INSERT INTO apps (app_id, title, description,a_category_id,created_at) VALUES (6,'app6','some description','1',CURRENT_TIMESTAMP);
INSERT INTO apps (app_id, title, description,a_category_id,created_at) VALUES (7,'app7','some description','1',CURRENT_TIMESTAMP);
INSERT INTO apps (app_id, title, description,a_category_id,created_at) VALUES (8,'app8','some description','1',CURRENT_TIMESTAMP);
INSERT INTO apps (app_id, title, description,a_category_id,created_at) VALUES (9,'app9','some description','1',CURRENT_TIMESTAMP);
INSERT INTO apps (app_id, title, description,a_category_id,created_at) VALUES (10,'app10','some description','1',CURRENT_TIMESTAMP);
INSERT INTO apps (app_id, title, description,a_category_id,created_at) VALUES (11,'app11','some description','1',CURRENT_TIMESTAMP);
INSERT INTO apps (app_id, title, description,a_category_id,created_at) VALUES (12,'app12','some description','1',CURRENT_TIMESTAMP);
INSERT INTO apps (app_id, title, description,a_category_id,created_at) VALUES (13,'app13','some description','1',CURRENT_TIMESTAMP);
INSERT INTO apps (app_id, title, description,a_category_id,created_at) VALUES (14,'app14','some description','1',CURRENT_TIMESTAMP);
INSERT INTO apps (app_id, title, description,a_category_id,created_at) VALUES (15,'app15','some description','1',CURRENT_TIMESTAMP);
INSERT INTO apps (app_id, title, description,a_category_id,created_at) VALUES (16,'app16','some description','1',CURRENT_TIMESTAMP);
INSERT INTO apps (app_id, title, description,a_category_id,created_at) VALUES (17,'app17','some description','1',CURRENT_TIMESTAMP);
INSERT INTO apps (app_id, title, description,a_category_id,created_at) VALUES (18,'app18','some description','1',CURRENT_TIMESTAMP);
INSERT INTO apps (app_id, title, description,a_category_id,created_at) VALUES (19,'app19','some description','1',CURRENT_TIMESTAMP);
INSERT INTO apps (app_id, title, description,a_category_id,created_at) VALUES (20,'app20','some description','1',CURRENT_TIMESTAMP);
select setval('apps_app_id_seq', (select max(app_id) from apps));
