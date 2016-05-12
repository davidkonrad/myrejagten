'use strict';

module.exports = function(sequelize, DataTypes) {
	var Proeve = sequelize.define("proeve", {
    proeve_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    proeve_nr: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lokalitet_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    indsamlingsdato: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Analyseret: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Indsamler: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Mailadresse: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ProeverModtaget: {
      type: DataTypes.DATE,
      allowNull: true
    },
    DatoForEkst: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ElueretI: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ngUl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    AntalKuverter: {
      type: DataTypes.STRING,
      allowNull: true
    },
    SNM_Adresse: {
      type: DataTypes.INTEGER(100),
      allowNull: true
    },
    kommentar: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    dataset: {
      type: DataTypes.STRING,
      allowNull: true
    }
	}, {
		tableName: 'proeve',
		timestamps: false,
		freezeTableName: true

	});

	return Proeve;
};
