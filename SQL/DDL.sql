create table publishers(
     publisherID bigint not null,
     name varchar(20) not null,
     email varchar(35) not null,
     address varchar(35) not null,
     bankAccount bigint not null,

     primary key(publisherID)
);

create table authors(
     email varchar(35) not null,
     name varchar(20) not null,

     primary key(email)
);

create table books(
     ISBN bigint not null,
     title varchar (50) not null,
     price float not null,
     pageNumber int not null,
     publisher varchar (20) not null,
     inStock smallint not null,
     publishedYear smallint not null,
     publisherSalePercentage numeric(5,2) not null,
     publisherID bigint not null,

     primary key(ISBN),
     foreign key(publisherID) references publishers
);

create table phoneNumbers(
     phoneNumber bigint not null,
     publisherID bigint not null,

     primary key(phoneNumber),
     foreign key(publisherID) references publishers
);

create table writes(
     ISBN bigint not null,
     email varchar (35) not null,

     primary key(ISBN, email),
     foreign key(ISBN) references books,
     foreign key(email) references authors
);

create table users(
     username   varchar(20) not null,
     password   varchar(20) not null,
     isManager char(1),

     primary key(username)
);

create table billingInfo(
     cardNumber bigint not null,
     name varchar(20) not null,
     address varchar(35) not null,
     username varchar(20) not null,

     primary key(cardNumber),
     foreign key(username) references users
);

create table orders(
     orderNumber int not null,
     shippingAddress varchar(35) not null,
     orderDate date not null,
     trackingInfo varchar(35) not null,
     totalAmout numeric(8, 2) not null,
     cardNumber bigint not null,

     primary key(orderNumber),
     foreign key(cardNumber) references billingInfo
);

create table contains(
     orderNumber int not null,
     ISBN bigint not null,
     quantity smallint not null,

     primary key(orderNumber),
     foreign key(orderNumber) references orders,
     foreign key(ISBN) references books
);

create table saleReport(
     reportID int not null,
     totalSaleMade numeric(8, 2) not null,
     totalExpenditure numeric(8, 2) not null,
     orderNumber int not null,

     primary key(reportID),
     foreign key(orderNumber) references orders
);

create table genres(
     ISBN bigint not null,
     genre varchar(20),

     primary key(ISBN, genre),
     foreign key(ISBN) references books
);

create table amountSoldPerGenre(
     reportID int not null,
     genre varchar(20) not null,
     amountSold int not null,

     primary key(reportID, genre),
     foreign key(reportID) references saleReport
);

create table amountSoldPerAuthor(
     reportID int not null,
     email varchar(35) not null,
     amountSold int not null,

     primary key(reportID, email),
     foreign key(reportID) references saleReport,
     foreign key(email) references authors
);