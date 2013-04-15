/**!
 * Dada Base adapter
 *
 * @package    ismax
 * @subpackage library
 * @author     Xiondlph <admin@ismax.ru>
 **/

/**!
 * Адаптер Базы данных
 **/

// Объявление модулей
var mongo       = require('mongodb'),
    Server      = mongo.Server,
    Db          = mongo.Db,
    BSON        = mongo.BSONPure,
    server      = new Server('localhost', 27017, {auto_reconnect: true}),
    db          = new Db('ismax', server, {safe:true});

// Експорт объекта базы данных
exports.db = db;

// Експорт объекта bson
exports.bson = BSON;