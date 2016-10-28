'use strict';


module.exports = function(sequelize, DataTypes) {
	var Content = sequelize.define("content", {
		content_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
		},
		name: {
      type: DataTypes.STRING,
      allowNull: true
    },
		content: {
      type: DataTypes.STRING,
      allowNull: true
    }

	}, {
		tableName: 'content',
		timestamps: false,
		freezeTableName: true

	});

	return Content;
};
