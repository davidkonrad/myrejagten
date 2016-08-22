'use strict';


module.exports = function(sequelize, DataTypes) {
	var Fag = sequelize.define("fag", {
		fag_id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
    fag_navn: {
      type: DataTypes.STRING,
      allowNull: false
    }	
	}, {
		tableName: 'fag',
		timestamps: false,
		freezeTableName: true

	});

	return Fag;
};
