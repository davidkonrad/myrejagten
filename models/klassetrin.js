/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('klassetrin', {
    klassetrin_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    klassetrin_navn: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'klassetrin',
    freezeTableName: true
  });
};
