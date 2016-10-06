'use strict';


module.exports = function(sequelize, DataTypes) {

	var Data = sequelize.define("data", {
		data_id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		eksperiment_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		madding :  {
      type: DataTypes.STRING,
      allowNull: true
    },
		myrer_indsamlet :  {
      type: DataTypes.FLOAT(5,2),
      allowNull: true
    },
		myrer_frysning :  {
      type: DataTypes.INTEGER(5),
      allowNull: true
    },
		madding_stjaalet :  {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
		proeve_modtaget :  {
      type: DataTypes.DATE,
      allowNull: true
    },
		proeve_analyseret :  {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
	
	}, {
		tableName: 'data',
		timestamps: false,
		freezeTableName: true

	});

	return Data;
};


