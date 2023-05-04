ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
flush privileges;
SET SQL_SAFE_UPDATES = 0;

create database userdb;
use userdb;

create table logininfo (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(45),
    userpassword VARCHAR(128)
);

insert into logininfo(username, userpassword) 
values  ("admin", "e52b8910d3dd2b91e6981a5b0df632b7"),
		("workerjoe", "e04efcfda166ec49ba7af5092877030e"); 
        
select * from logininfo;


create table menuitems(
    name VARCHAR(128) PRIMARY KEY,
    price DECIMAL(10,2)  NOT NULL
);

insert into menuitems(name, price) 
values  ("fish", 2.03),
		("cheese", 23),
        ("DOG", 0.03);

create table shoppingbasket(
    name VARCHAR(128),
    price DECIMAL(10,2)  NOT NULL
);

INSERT INTO shoppingbasket SELECT * FROM menuitems WHERE name = "fish";

insert into shoppingbasket(name, price) 
values  ("DOG", 0.03),  ("Cat", 2.03) , ("hot chocolate", 0.01);

select * from shoppingbasket;

DELETE FROM shoppingbasket;

drop table shoppingbasket;
drop table menuitems;
