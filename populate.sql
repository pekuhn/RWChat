CREATE DATABASE web_chat;
USE web_chat;
CREATE TABLE messages (
	id MEDIUMINT NOT NULL AUTO_INCREMENT,
	message TEXT NOT NULL,
	username CHAR(100),
	valence CHAR(100),
	PRIMARY KEY (id)
);
CREATE USER 'web_chat'@'localhost';
GRANT ALL PRIVILEGES ON web_chat.* To 'web_chat'@'localhost' IDENTIFIED BY 'pw';
