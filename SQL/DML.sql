insert into publishers
values (1, 'Bloomberg', 'bloomberg@gmail.com', '31 Bedford Avenue, London', 1234);

insert into phoneNumbers
values (1234568790, 1);

insert into authors
values ('jkrowling@gmail.com', 'J. K. Rowling');

insert into books
values (1, 'Harry Potter and the Philosophers Stone', 1997, 'Bloomberg', 223, 9.99, 10, null, null),
       (2, 'Harry Potter and the Chamber of Secrets', 1998, 'Bloomberg', 251, 9.99, 10, null, null),
       (3, 'Harry Potter and the Prisoner of Azkaban', 1999, 'Bloomberg', 317, 9.99, 10, null, null),
       (4, 'Harry Potter and the Goblet of Fire', 2000, 'Bloomberg', 636, 9.99, 10, null, null),
       (5, 'Harry Potter and the Order of the Pheonix', 2003, 'Bloomberg', 766, 9.99, 10, null, null),
       (6, 'Harry Potter and the Half-Blood Prince', 2005, 'Bloomberg', 607, 9.99, 10, null, null),
       (7, 'Harry Potter and the Deathly Hallows', 2007, 'Bloomberg', 607, 9.99, 10, null, null);

insert into writes
values (1, 'jkrowling@gmail.com'),
       (2, 'jkrowling@gmail.com'),
       (3, 'jkrowling@gmail.com'),
       (4, 'jkrowling@gmail.com'),
       (5, 'jkrowling@gmail.com'),
       (6, 'jkrowling@gmail.com'),
       (7, 'jkrowling@gmail.com');

insert into genres
values (1, 'Fantasy'),
       (2, 'Fantasy'),
       (3, 'Fantasy'),
       (4, 'Fantasy'),
       (5, 'Fantasy'),
       (6, 'Fantasy'),
       (7, 'Fantasy');

insert into users
values ('abbas', 'abbas', 'Owner'),
       ('adam', 'adam', 'Owner'),
       ('ethan', 'ethan', 'Owner');