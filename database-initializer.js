var pgtools = require('pgtools');
const { Pool } = require('pg')
var fs = require('fs');

const config = {
  user: 'postgres',
  password: 'admin',
  port: 5432,
  host: 'localhost'
}

pgtools.dropdb(config, 'mainDB', function (err, res) {
    if (err && err.name !== 'invalid_catalog_name') {
      console.error(err);
      process.exit(-1);
    }
    else{
        if(!err){
            console.log('DB "mainDB" dropped successfully')
        }
        createDB();
    }
});

const pool = new Pool({
	host: 'localhost',
	port: 5432,
	user: 'postgres',
    database: 'postgres',
	password: 'admin'
})

function createDB(){
    const text = 'CREATE DATABASE "mainDB"\
                    WITH\
                    OWNER = postgres\
                    ENCODING = "UTF8"\
                    LC_COLLATE = "English_Canada.1252"\
                    LC_CTYPE = "English_Canada.1252"\
                    TABLESPACE = pg_default\
                    CONNECTION LIMIT = -1\
                    IS_TEMPLATE = False;'

    pool.connect((err, client, done) => {
        if (err) throw err
        client.query(text, (err, res) => {
            if (err) {
                console.log(err.stack)
            } else {
                console.log('DB "mainDB" created successfully')
                pool.options.database = 'mainDB'
                loadDDL();
            }
            client.release();
        })
    })
}

function loadDDL(){
    var sql = fs.readFileSync('./SQL/DDL.sql').toString();
    pool.connect((err, client, done) => {
        if (err) throw err
        client.query(sql, (err, res) => {
            if (err) {
                console.log(err.stack)
            } else {
                console.log('DDL loaded successfully')
                pool.end();
            }
            client.release();
        })
    })
}
