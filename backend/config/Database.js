
// import {Sequelize} from "sequelize";

// const db = new Sequelize('authentification','root','',{
//     host: "localhost",
//     dialect: "mysql",
//     port: 3306,
// });

import  { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const sequelize =new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD,{
    host:process.env.DB_HOST,
    // dialect:"mariadb",
    dialect: "mysql",
    port:process.env.DB_PORT,
    //desactiver les log
    logging: false,
});

// Tester la connexion
sequelize.authenticate()
  .then(() => {
    console.log('Connexion à la base de données réussie!');
  })
  .catch((err) => {
    console.error('Impossible de se connecter à la base de données :', err);
  });

export default sequelize;