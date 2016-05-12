/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('klasse', {
    klasse_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    booking_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    lokalitet_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    institutionsnavn: {
      type: DataTypes.STRING,
      allowNull: false
    },
    adresse: {
      type: DataTypes.STRING,
      allowNull: false
    },
    postnr: {
      type: DataTypes.STRING,
      allowNull: false
    },
    by: {
      type: DataTypes.STRING,
      allowNull: false
    },
    kommune: {
      type: DataTypes.STRING,
      allowNull: false
    },
    region: {
      type: DataTypes.STRING,
      allowNull: false
    },
    klassetrin: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fag: {
      type: DataTypes.STRING,
      allowNull: false
    },
    laererNavn: {
      type: DataTypes.STRING,
      allowNull: false
    },
    laererTlf: {
      type: DataTypes.STRING,
      allowNull: false
    },
    laererEmail: {
      type: DataTypes.STRING,
      allowNull: false
    },
    antalElever: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    antalLaerer: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    KuvertProeverAfsendt: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    Proevermodtaget: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    SendtInfoMailTilLaerer: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    UdtraekFraFiskedatabasen: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    DatoForBesoeg: {
      type: DataTypes.DATE,
      allowNull: false
    },
    DatoForBooking: {
      type: DataTypes.DATE,
      allowNull: false
    },
    DatoForEkst: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'klasse',
    freezeTableName: true
  });
};
