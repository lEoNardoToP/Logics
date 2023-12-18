CREATE TABLE `users` (
    `id` varchar(30) NOT NULL,
    `username` varchar(50) NOT NULL,
    `password` varchar(255) NOT NULL,
    `email` varchar(255) NOT NULL,
    `status` varchar(50) NOT NULL,
    `verified` int(11) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `comments`(
`cid` int(11) not null  AUTO_INCREMENT PRIMARY KEY,
`uid` varchar(30) not null,
`date` datetime not null,
`message` TEXT not null,
`stars` int(11) not null
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `messages`(
`msg_id` int(30) not null  AUTO_INCREMENT PRIMARY KEY,
`incoming_msg_id` varchar(30) not null,
`outgoing_msg_id` varchar(30) not null,
`msg` TEXT not null
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `ips`(
`ip` varchar(30) not null PRIMARY KEY,
`date` datetime not null,
`tentativi` int(30) not null
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
