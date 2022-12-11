create table users
	(
     username   varchar(20) not null,
     password   varchar(20) not null,
     accountType varchar (20),
     primary key(username)
	);

create table books(
     ISBN bigint not null,
     title varchar (50) not null,
     author varchar (20) not null,
     yearPublished int not null,
     publisher varchar (20) not null, 
     genre varchar (20) not null,
     pageNumber int not null,
     price float not null,
     inventory int not null,
     primary key(ISBN)
);

