'use strict';


module.exports = function(sequelize, DataTypes) {

	var Booking = sequelize.define('booking', {	
    booking_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    sagsNo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    DatoForBooking: {
      type: DataTypes.DATE,
      allowNull: true
    },
    DatoForBesoeg: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    timestamp_created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    periode: {
      type: DataTypes.INTEGER(11),
			allowNull: true
    },
    aar_periode: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
		lokalitet_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'booking',
		timestamps: false,
    freezeTableName: true,
		classMethods: {
      associate: function(models) {
        models.Booking.hasMany(models.Klasse, { foreignKey : 'booking_id', as : 'Klasse' })
			}
		}

	})	

	return Booking

};
