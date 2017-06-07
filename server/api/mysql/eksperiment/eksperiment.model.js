'use strict';


module.exports = function(sequelize, DataTypes) {

	var Eksperiment = sequelize.define("eksperiment", {
		eksperiment_id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
    created_timestamp: {
      type: DataTypes.DATE,
      allowNull: true
    },
    projekt_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    myrejagt_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
		dato :  {
      type: DataTypes.DATE,
      allowNull: true
    },
		start_tid :  {
      type: DataTypes.STRING,
      allowNull: true
    },
		slut_tid :  {
      type: DataTypes.STRING,
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
    upload_billede: {
      type: DataTypes.STRING,
      allowNull: true
    },
    temp: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    vejr: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sol: {
      type: DataTypes.STRING,
      allowNull: true
    },
    vind: {
      type: DataTypes.STRING,
      allowNull: true
    },
    kommentar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    data_kommentar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    UTM: {
      type: DataTypes.STRING,
      allowNull: true
    }

	}, {
		tableName: 'eksperiment',
		timestamps: false,
		freezeTableName: true,
		classMethods: {
      associate: function(models) {
        models.Eksperiment.hasMany(models.Data, { foreignKey : 'eksperiment_id', as : 'Data' })
        models.Eksperiment.belongsTo(models.User, { foreignKey : 'user_id', as : 'User' })
			}
		}

	});

	return Eksperiment;
};


