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
      type: DataTypes.STRING,
      allowNull: true
    },
		myrer_frysning :  {
      type: DataTypes.STRING,
      allowNull: true
    },
		maden_stjaalet :  {
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


