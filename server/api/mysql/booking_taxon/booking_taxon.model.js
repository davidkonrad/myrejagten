'use strict';


module.exports = function(sequelize, DataTypes) {

	var Booking_taxon = sequelize.define("booking_taxon", {
		booking_taxon_id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
    booking_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    taxon_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
		is_included: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }

	}, {
		tableName: 'booking_taxon',
		timestamps: false,
		freezeTableName: true
	});

	return Booking_taxon;
};
