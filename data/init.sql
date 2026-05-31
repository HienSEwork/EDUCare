set names utf8mb4;

create database if not exists educare
  character set utf8mb4
  collate utf8mb4_unicode_ci;

use educare;

create table if not exists users (
  id varchar(36) primary key,
  full_name varchar(120) not null,
  email varchar(190) not null unique,
  username varchar(80) not null unique,
  password_hash varchar(255) not null,
  age int not null,
  plan varchar(20) not null,
  xp int not null default 0,
  streak int not null default 0,
  quiz_score_total int not null default 0,
  avatar_url varchar(255),
  role varchar(20) not null,
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

create table if not exists password_reset_tokens (
  id bigint primary key auto_increment,
  token varchar(255) not null unique,
  user_id varchar(36) not null,
  expires_at timestamp not null,
  created_at timestamp not null default current_timestamp,
  constraint fk_password_reset_user foreign key (user_id) references users (id) on delete cascade,
  index idx_password_reset_user (user_id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

create table if not exists lessons (
  id bigint primary key auto_increment,
  slug varchar(120) not null unique,
  title varchar(255) not null,
  summary text not null,
  content longtext not null,
  lesson_order int not null unique,
  is_free boolean not null default true,
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

create table if not exists blog_posts (
  id bigint primary key auto_increment,
  slug varchar(120) not null unique,
  title varchar(255) not null,
  excerpt text not null,
  content longtext not null,
  category varchar(120) not null,
  published_at date not null,
  read_time_minutes int not null,
  emoji varchar(20) not null,
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

create table if not exists games (
  id bigint primary key auto_increment,
  slug varchar(120) not null unique,
  title varchar(180) not null,
  summary text not null,
  description longtext not null,
  game_type varchar(40) not null,
  play_path varchar(255) not null,
  cover_image varchar(255),
  accent_color varchar(30) not null default '#9b5de5',
  is_published boolean not null default true,
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

create table if not exists quiz_questions (
  id bigint primary key auto_increment,
  slug varchar(160) not null unique,
  prompt text not null,
  category varchar(120) not null,
  difficulty varchar(40) not null,
  question_type varchar(40) not null default 'MULTIPLE_CHOICE',
  options_json text not null,
  correct_index int not null,
  explanation text,
  sort_order int not null,
  is_active boolean not null default true,
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

create table if not exists quiz_attempts (
  id bigint primary key auto_increment,
  user_id varchar(36),
  mode varchar(20) not null,
  total_questions int not null,
  correct_answers int not null,
  score int not null,
  xp_awarded int not null default 0,
  created_at timestamp not null default current_timestamp,
  constraint fk_quiz_attempt_user foreign key (user_id) references users (id) on delete set null,
  index idx_quiz_attempt_user (user_id),
  index idx_quiz_attempt_created_at (created_at)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

create table if not exists lesson_progress (
  id bigint primary key auto_increment,
  user_id varchar(36) not null,
  lesson_id bigint not null,
  xp_awarded int not null default 50,
  completed_at timestamp not null default current_timestamp,
  constraint fk_lesson_progress_user foreign key (user_id) references users (id) on delete cascade,
  constraint fk_lesson_progress_lesson foreign key (lesson_id) references lessons (id) on delete cascade,
  unique key uq_user_lesson (user_id, lesson_id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

create table if not exists community_posts (
  id bigint primary key auto_increment,
  user_id varchar(36),
  author_name varchar(120) not null,
  anonymous boolean not null default false,
  content text not null,
  likes_count int not null default 0,
  created_at timestamp not null default current_timestamp,
  constraint fk_community_post_user foreign key (user_id) references users (id) on delete set null
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

create table if not exists community_replies (
  id bigint primary key auto_increment,
  post_id bigint not null,
  user_id varchar(36),
  author_name varchar(120) not null,
  anonymous boolean not null default false,
  content text not null,
  likes_count int not null default 0,
  created_at timestamp not null default current_timestamp,
  constraint fk_community_reply_post foreign key (post_id) references community_posts (id) on delete cascade,
  constraint fk_community_reply_user foreign key (user_id) references users (id) on delete set null
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

create table if not exists community_post_likes (
  id bigint primary key auto_increment,
  post_id bigint not null,
  user_id varchar(36) not null,
  created_at timestamp not null default current_timestamp,
  constraint fk_community_post_like_post foreign key (post_id) references community_posts (id) on delete cascade,
  constraint fk_community_post_like_user foreign key (user_id) references users (id) on delete cascade,
  unique key uq_post_like (post_id, user_id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

create table if not exists community_reply_likes (
  id bigint primary key auto_increment,
  reply_id bigint not null,
  user_id varchar(36) not null,
  created_at timestamp not null default current_timestamp,
  constraint fk_community_reply_like_reply foreign key (reply_id) references community_replies (id) on delete cascade,
  constraint fk_community_reply_like_user foreign key (user_id) references users (id) on delete cascade,
  unique key uq_reply_like (reply_id, user_id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

create table if not exists chat_rooms (
  id bigint primary key auto_increment,
  slug varchar(120) not null unique,
  name varchar(120) not null,
  description text not null,
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

create table if not exists chat_messages (
  id bigint primary key auto_increment,
  room_id bigint not null,
  user_id varchar(36),
  author_name varchar(120) not null,
  content text not null,
  created_at timestamp not null default current_timestamp,
  constraint fk_chat_message_room foreign key (room_id) references chat_rooms (id) on delete cascade,
  constraint fk_chat_message_user foreign key (user_id) references users (id) on delete set null
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

create table if not exists anonymous_questions (
  id bigint primary key auto_increment,
  user_id varchar(36),
  question text not null,
  answer text not null,
  likes_count int not null default 0,
  created_at timestamp not null default current_timestamp,
  constraint fk_anonymous_question_user foreign key (user_id) references users (id) on delete set null
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

create table if not exists anonymous_question_likes (
  id bigint primary key auto_increment,
  question_id bigint not null,
  user_id varchar(36) not null,
  created_at timestamp not null default current_timestamp,
  constraint fk_anonymous_question_like_question foreign key (question_id) references anonymous_questions (id) on delete cascade,
  constraint fk_anonymous_question_like_user foreign key (user_id) references users (id) on delete cascade,
  unique key uq_question_like (question_id, user_id)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

create table if not exists mood_entries (
  id bigint primary key auto_increment,
  user_id varchar(36) not null,
  mood_code varchar(30) not null,
  note text,
  entry_date date not null,
  constraint fk_mood_entry_user foreign key (user_id) references users (id) on delete cascade,
  unique key uq_user_mood_date (user_id, entry_date)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;

create table if not exists notifications (
  id bigint primary key auto_increment,
  user_id varchar(36) not null,
  type varchar(50) not null,
  title varchar(255) not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamp not null default current_timestamp,
  constraint fk_notification_user foreign key (user_id) references users (id) on delete cascade
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;
