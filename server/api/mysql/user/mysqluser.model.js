'use strict';


module.exports = function(sequelize, DataTypes) {
	var MysqlUser = sequelize.define("user", {
		user_id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true,
			allowNull: true
		},
		is_admin: {
			type: DataTypes.BOOLEAN,
      allowNull: true
    },
		hash: {
			type: DataTypes.STRING,
      allowNull: true
    },
		email: {
			type: DataTypes.STRING,
      allowNull: true
    },
		confirmed: {
			type: DataTypes.BOOLEAN,
      allowNull: true
    },
		brugernavn: {
			type: DataTypes.STRING,
      allowNull: true
    },
		password: {
			type: DataTypes.STRING,
      allowNull: true
    },
		role: {
			type: DataTypes.INTEGER,
      allowNull: true
    },
		institution: {
			type: DataTypes.STRING,
      allowNull: true
    },
		fulde_navn: {
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
    }
						

	}, {
		tableName: 'user',
		timestamps: false,
		freezeTableName: true

	});

	return MysqlUser;
};
