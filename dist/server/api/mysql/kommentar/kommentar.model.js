'use strict';


module.exports = function(sequelize, DataTypes) {
	var Kommentar = sequelize.define("kommentar", {
		kommentar_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
		},
    type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    relation_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
	  kommentar: {
      type: DataTypes.STRING,
      allowNull: true
    },
		created_timestamp : {
      type: DataTypes.DATE,
      allowNull: true
    }, 
		created_userName : {
      type: DataTypes.STRING,
      allowNull: true
    }

	}, {
		tableName: 'kommentar',
		timestamps: false,
		freezeTableName: true

	});

	return Kommentar;
};
