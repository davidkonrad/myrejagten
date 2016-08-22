'use strict';


module.exports = function(sequelize, DataTypes) {

	var Klasse = sequelize.define("klasse", {
		klasse_id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
    booking_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    lokalitet_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    institutionsnavn: {
      type: DataTypes.STRING,
      allowNull: true
    },
    adresse: {
      type: DataTypes.STRING,
      allowNull: true
    },
    postnr: {
      type: DataTypes.STRING,
      allowNull: true
    },
    by: {
      type: DataTypes.STRING,
      allowNull: true
    },
    kommune: {
      type: DataTypes.STRING,
      allowNull: true
    },
    region: {
      type: DataTypes.STRING,
      allowNull: true
    },
    klassetrin: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fag: {
      type: DataTypes.STRING,
      allowNull: true
    },
    laererNavn: {
      type: DataTypes.STRING,
      allowNull: true
    },
    laererTlf: {
      type: DataTypes.STRING,
      allowNull: true
    },
    laererEmail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    antalElever: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    antalLaerer: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    KuvertProeverAfsendt: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    Proevermodtaget: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    DatoForBesoeg: {
      type: DataTypes.DATE,
      allowNull: true
    },
    DatoForBooking: {
      type: DataTypes.DATE,
      allowNull: true
    },
    DatoForEkst: {
      type: DataTypes.DATE,
      allowNull: true
    }

  }, {
		tableName: 'klasse',
		timestamps: false,
		freezeTableName: true
			
	});

	return Klasse;

};


