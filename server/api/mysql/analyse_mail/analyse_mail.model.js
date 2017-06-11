'use strict';


module.exports = function(sequelize, DataTypes) {
	var Analyse_mail = sequelize.define("analyse_mail", {
		analyse_mail_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
		},
		eksperiment_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
		},
		myrejagt_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
		},
		email: {
      type: DataTypes.STRING,
      allowNull: false
    },
		send_timestamp :  {
      type: DataTypes.DATE,
      allowNull: true
    },
		mail_body: {
      type: DataTypes.STRING,
      allowNull: true
    },
		attachments: {
      type: DataTypes.STRING,
      allowNull: true
    }

	}, {
		tableName: 'analyse_mail',
		timestamps: false,
		freezeTableName: true

	});

	return Analyse_mail;
};
