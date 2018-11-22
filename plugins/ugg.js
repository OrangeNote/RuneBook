const request = require('request');
const { map } = require('lodash');

// U.GG API consts
// data[servers][tiers][positions][0][stats][perks/shards]
const u = {
  positions: {
    jungle: 1,
    support: 2,
    adc: 3,
    top: 4,
    mid: 5
  },
  positionsReversed: {
    1: 'Jungle',
    2: 'Support',
    3: 'ADC',
    4: 'Top',
    5: 'Mid'
  },
  tiers: {
    challenger: 1,
    master: 2,
    diamond: 3,
    platinum: 4,
    gold: 5,
    silver: 6,
    bronze: 7,
    overall: 8,
    platPlus: 10,
    diaPlus: 11
  },
  servers: {
    na: 1,
    euw: 2,
    kr: 3,
    eune: 4,
    br: 5,
    las: 6,
    lan: 7,
    oce: 8,
    ru: 9,
    tr: 10,
    jp: 11,
    world: 12
  },
  stats: {
    perks: 0,
    statShards: 8
  },
  perks: {
    games: 0,
    won: 1,
    mainPerk: 2,
    subPerk: 3,
    perks: 4
  },
  shards: {
    games: 0,
    won: 1,
    stats: 2
  }
};

// KEY CONSTS - UPDATE THESE ACCORDING TO GUIDE (which is not done btw)
const uGGDataVersion = '1.2';
const uGGAPIVersion = '1.1';

const riotVersionEndpoint = 'https://ddragon.leagueoflegends.com/api/versions.json';
const uGGDataVersionsEndpoint = 'https://u.gg/json/new_ugg_versions/' + uGGDataVersion + '.json';

const getUGGFormattedLolVersion = lolVer =>
  lolVer
    .split('.')
    .splice(0, 2)
    .join('_');

// this is actually a goddamn callback hell
function getDataSource(champion, callback) {
  request.get(riotVersionEndpoint, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const lolVersions = JSON.parse(body);

      let lolVersion = lolVersions[0];
      let lolVersionUGG = getUGGFormattedLolVersion(lolVersion);

      request.get(uGGDataVersionsEndpoint, (error1, response1, body1) => {
        if (!error1 && response1.statusCode === 200) {
          const uGGStatsVersions = JSON.parse(body1);

          // it might be too early for u.gg to have stats, in that case use previous patch data
          if (!uGGStatsVersions[lolVersionUGG]) {
            lolVersion = lolVersions[1];
            lolVersionUGG = getUGGFormattedLolVersion(lolVersion);
          }

          const overviewVersion = uGGStatsVersions[lolVersionUGG].overview;

          request.get(
            `https://static.u.gg/lol/riot_static/${lolVersion}/data/en_US/champion/${champion}.json`,
            (error2, response2, body2) => {
              if (!error2 && response2.statusCode === 200) {
                const championData = JSON.parse(body2);
                const championId = championData.data[champion].key;

                request.get(
                  `https://stats.u.gg/lol/${uGGAPIVersion}/overview/${lolVersionUGG}/ranked_solo_5x5/${championId}/${overviewVersion}.json`,
                  (error3, response3, body3) => {
                    if (!error3 && response3.statusCode === 200) {
                      callback(JSON.parse(body3));
                    } else {
                      callback(null);
                      throw Error('rune page not loaded');
                    }
                  }
                );
              } else {
                callback(null);
                throw Error('rune page not loaded');
              }
            }
          );
        } else {
          callback(null);
          throw Error('rune page not loaded');
        }
      });
    } else {
      callback(null);
      throw Error('rune page not loaded');
    }
  });
}

function _getPages(champion, callback) {
  const runePages = { pages: {} };

  getDataSource(champion, data => {
    if (data) {
      const pages = map(data[u.servers.world][u.tiers.platPlus], (item, key) => {
        const perksData = item[0][u.stats.perks];
        const statShards = item[0][u.stats.statShards][u.shards.stats].map(str => parseInt(str, 10));
        const selectedPerkIds = perksData[u.perks.perks].concat(statShards);

        return {
          name: `${champion} ${u.positionsReversed[key]}`,
          primaryStyleId: perksData[u.perks.mainPerk],
          subStyleId: perksData[u.perks.subPerk],
          selectedPerkIds,
          // usageStats: {
          //   games: perksData[u.perks.games],
          //   won: perksData[u.perks.won]
          // }
        };
      });

      console.log(pages);

      // todo filter out bad roles

      pages.forEach(page => {
        runePages.pages[page.name] = page;
      });
      callback(runePages);
    } else {
      callback(runePages);
      throw Error('rune page not loaded');
    }
  });
}

const plugin = {
  id: 'ugg',
  name: 'U.GG',
  active: true,
  bookmarks: false,
  getPages(champion, callback) {
    _getPages(champion, callback);
  }
};

module.exports = { plugin };
