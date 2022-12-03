create table user
	(
     username   varchar(20) not null,
     password   varchar(20) not null,
     isManager char(1),
     primary key(username, password)
	);

create table books(
     ISBN int(10) not null,
     title varchar (50) not null,
     author varchar (20) not null,
     yearPublished int(4) not null,
     publisher varchar (20) not null, 
     genre varchar (20) not null,
     pageNumber int (4) not null,
     price float (5) not null,
     primary key(ISBN)
);

