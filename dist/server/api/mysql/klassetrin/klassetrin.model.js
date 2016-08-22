'use strict';


module.exports = function(sequelize, DataTypes) {
	var Klassetrin = sequelize.define("klassetrin", {
		klassetrin_id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
    klassetrin_navn: {
      type: DataTypes.STRING,
      allowNull: false
    }	
	}, {
		tableName: 'klassetrin',
		timestamps: false,
		freezeTableName: true

	});

	return Klassetrin;
};
