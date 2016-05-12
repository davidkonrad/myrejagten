'use strict';


module.exports = function(sequelize, DataTypes) {
	var Resultat_item = sequelize.define("resultat_item", {
		resultat_item_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
		},
    resultat_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    taxon_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    analyseret: {
      type: DataTypes.DATE,
      allowNull: true
    },
    positiv: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    negativ: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    eDNA: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    database_result: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }, 
		Ct_vaerdi: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		}
 
	}, {
		tableName: 'resultat_item',
		timestamps: false,
		freezeTableName: true

	});

	return Resultat_item;
};
