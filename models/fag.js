/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('fag', {
    fag_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    fag_navn: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'fag',
    freezeTableName: true
  });
};
