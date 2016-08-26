'use strict';


module.exports = function(sequelize, DataTypes) {
	var Projekt = sequelize.define("projekt", {
		projekt_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
		},
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
		created_timestamp: {
      type: DataTypes.DATE,
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
    },
		geometryWkt: {
      type: DataTypes.STRING,
      allowNull: true
    },
		start_tid: {
      type: DataTypes.DATE,
      allowNull: true
    },
		slut_tid: {
      type: DataTypes.DATE,
      allowNull: true
    }
 
	}, {
		tableName: 'projekt',
		timestamps: false,
		freezeTableName: true

	});

	return Projekt;
};
