'use strict';


module.exports = function(sequelize, DataTypes) {

	var Eksperiment = sequelize.define("eksperiment", {
		eksperiment_id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
    projekt_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    titel: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lokalitet: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lat: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lng: {
      type: DataTypes.STRING,
      allowNull: true
    }
	
	}, {
		tableName: 'eksperiment',
		timestamps: false,
		freezeTableName: true

	});

	return Eksperiment;
};


