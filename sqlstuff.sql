ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
flush privileges;
SET SQL_SAFE_UPDATES = 0;

create database userdb;
use userdb;

create table logininfo (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(45),
    userpassword VARCHAR(128),
    adminbool BOOLEAN
);

insert into logininfo(username, userpassword, adminbool) 
values  ("admin", "e52b8910d3dd2b91e6981a5b0df632b7", true),
		("workerjoe", "e04efcfda166ec49ba7af5092877030e", false); 
        
select * from logininfo;


create table menuitems(
	itemId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(128),
    stock INT,
    ageRestricted BOOLEAN,
    price DECIMAL(10,2)  NOT NULL
);

create table categories(
	categoryId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	category VARCHAR(128)
);

insert into menuitems(name, price) 
values  ("fish", 2.03),
		("cheese", 23),
        ("DOG", 0.03);
        
create table shoppingbasket(
	shoppingItemId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    itemId INT NOT NULL,
    foreign key (itemId) REFERENCES menuitems(itemid),
    name VARCHAR(128),
	stock INT,
    ageRestricted BOOLEAN,
    price DECIMAL(10,2)  NOT NULL
);

create table pastTransactions(
	transactionID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    price DECIMAL(10, 2) NOT NULL
);


INSERT INTO shoppingbasket (itemId, name, stock, ageRestricted, price) SELECT * FROM menuitems WHERE name = "fish";

insert into shoppingbasket(name, price) 
values  ("DOG", 0.03),  ("Cat", 2.03) , ("hot chocolate", 0.01);

select * from shoppingbasket;
delete from shoppingbasket order by shoppingItemId desc limit 1;

select * from menuitems;

DELETE FROM shoppingbasket;

drop table shoppingbasket;
drop table menuitems;
