
# USER TABLE
CREATE TABLE account(
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(255),
    bio VARCHAR(150)
);

CREATE TABLE post(
    post_id SERIAL PRIMARY KEY,
    account_id INT NOT NULL,
    posted DATE NOT NULL DEFAULT CURRENT_DATE,
    content VARCHAR(255),
    like_count INT default 0,
    comment_count INT default 0,
    CONSTRAINT fk_account FOREIGN KEY(account_id) REFERENCES account(user_id)
);

CREATE TABLE comments(
    post_id INT REFERENCES post(post_id) ON UPDATE CASCADE ON DELETE CASCADE,
    account_id INT REFERENCES account(user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    comment varchar(200),
    comment_id SERIAL PRIMARY KEY
);

CREATE TABLE friend(
    account_a_id INT REFERENCES account(user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    account_b_id INT REFERENCES account(user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (account_a_id, account_b_id)
);

CREATE TABLE hashtag(
    hashtag_id SERIAL PRIMARY KEY,
    hashtag VARCHAR(255) NOT NULL,
    usage INT DEFAULT 0
);

CREATE TABLE hashtag_post(
    post_id INT NOT NULL REFERENCES post(post_id) ON UPDATE CASCADE ON DELETE CASCADE,
    hashtag_id INT NOT NULL REFERENCES hashtag(hashtag_id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (post_id, hashtag_id)
);

CREATE TABLE likes(
    post_id INT NOT NULL REFERENCES post(post_id) ON UPDATE CASCADE ON DELETE CASCADE,
    account_id INT NOT NULL REFERENCES account(user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (post_id, account_id)
);