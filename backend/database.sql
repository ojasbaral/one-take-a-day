
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
    content VARCHAR(255)
    CONSTRAINT fk_account FOREIGN KEY(account_id) REFERENCES account(user_id)
);
