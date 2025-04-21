import { Sequelize } from "sequelize";
import db from "../../../config/Database.js";

const { DataTypes } = Sequelize;

const Prime_Employe = db.define('Prime_Employe', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
   PrimeId: {
          type: DataTypes.INTEGER,
          allowNull: false, 
          references: {
              model: 'Primes', 
              key: 'id', 
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
      },

      EmployeId: {
        type: DataTypes.INTEGER,
        allowNull: false, 
        references: {
            model: 'Employes', 
            key: 'id', 
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
},


{
  timestamps: false,
})

export default Prime_Employe;
