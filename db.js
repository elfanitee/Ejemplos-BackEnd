//conexion a bd
import mysql from 'mysql2';
const connection = mysql.createConnection({
  host: "localhost",
    user: "root",
    password: "",
    database: "escuela"
});

connection.connect((err)=>{
  if(err){
    console.error('Error al conectar', err);
  }else{
    console.log('Conexión exitosa');
  }
});

export default connection;