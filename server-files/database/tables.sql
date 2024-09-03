CREATE DATABASE Website CHARACTER SET = 'utf8' COLLATE = 'utf8_general_ci';

USE Website;

CREATE TABLE Users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  passwd VARCHAR(255) NOT NULL
);

CREATE TABLE Sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  session_id VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL DEFAULT TIMESTAMPADD(WEEK, 1, CURRENT_TIMESTAMP),
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
