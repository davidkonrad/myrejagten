'use strict';


module.exports = function(sequelize, DataTypes) {
	var Resultat = sequelize.define("resultat", {
		resultat_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
		},
    data_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
		navn_videnskabeligt: {
      type: DataTypes.STRING,
      allowNull: true
    },
		navn_dk: {
      type: DataTypes.STRING,
      allowNull: true
    },
		genus: {
      type: DataTypes.STRING,
      allowNull: true
    },
		specie: {
      type: DataTypes.STRING,
      allowNull: true
    },
		antal: {
      type: DataTypes.STRING,
      allowNull: true
    },
		kommentar: {
      type: DataTypes.STRING,
      allowNull: true
    }
 
	}, {
		tableName: 'resultat',
		timestamps: false,
		freezeTableName: true

	});

	return Resultat;
};
