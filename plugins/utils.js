const rp = require('request-promise-native');
const { groupBy } = require('lodash');

function getJson(uri) {
  return rp({ uri, json: true });
}

// http://ddragon.leagueoflegends.com/cdn/8.23.1/data/en_US/runesReforged.json
// tree = runes.reduce((obj, curr) => {
//   obj[curr.id] = [].concat(...curr.slots.map(row => row.runes.map(i => i.id)));
//   return obj;
// }, {})
function sortRunes(runes, primaryStyle, subStyle) {
  const indexes = new Map();
  const sortingFunc = (a, b) => indexes.get(a) - indexes.get(b);

  const tree = {
    8000: [8005, 8008, 8021, 8010, 9101, 9111, 8009, 9104, 9105, 9103, 8014, 8017, 8299],
    8100: [8112, 8124, 8128, 9923, 8126, 8139, 8143, 8136, 8120, 8138, 8135, 8134, 8105, 8106],
    8200: [8214, 8229, 8230, 8224, 8226, 8275, 8210, 8234, 8233, 8237, 8232, 8236],
    8300: [8351, 8359, 8360, 8306, 8304, 8313, 8321, 8316, 8345, 8347, 8410, 8352],
    8400: [8437, 8439, 8465, 8446, 8463, 8401, 8429, 8444, 8473, 8451, 8453, 8242]
  };
  const styles = Object.keys(tree);

  const groupedRunes = groupBy(runes, rune => {
    for (style of styles) {
      let runeIndex = tree[style].indexOf(rune);
      if (runeIndex !== -1) {
        indexes.set(rune, runeIndex);
        return style;
      }
    }
  });

  groupedRunes[primaryStyle].sort(sortingFunc);
  groupedRunes[subStyle].sort(sortingFunc);

  return groupedRunes[primaryStyle].concat(groupedRunes[subStyle]);
}

module.exports = { getJson, sortRunes };
