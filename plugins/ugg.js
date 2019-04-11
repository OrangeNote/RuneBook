const { map } = require('lodash');
const { getJson, sortRunes } = require('./utils');

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

// KEY CONSTS - UPDATE THESE ACCORDING TO GUIDE https://gist.github.com/paolostyle/fe8ce06313d3e53c134a24762b9e519c
const uGGDataVersion = '1.2';
const uGGAPIVersion = '1.1';

const riotVersionEndpoint = 'https://ddragon.leagueoflegends.com/api/versions.json';
const uGGDataVersionsEndpoint = 'https://u.gg/json/new_ugg_versions/' + uGGDataVersion + '.json';

const server = u.servers.world;
const tier = u.tiers.platPlus;

const getUGGFormattedLolVersion = lolVer =>
  lolVer
    .split('.')
    .splice(0, 2)
    .join('_');

function extractPage(champion) {
  return (item, key) => {
    const perksData = item[0][u.stats.perks];
    const statShards = item[0][u.stats.statShards][u.shards.stats].map(str => parseInt(str, 10));

    const primaryStyleId = perksData[u.perks.mainPerk];
    const subStyleId = perksData[u.perks.subPerk];

    const selectedPerkIds = sortRunes(perksData[u.perks.perks], primaryStyleId, subStyleId).concat(
      statShards
    );

    return {
      name: `${champion} ${u.positionsReversed[key]}`,
      primaryStyleId,
      subStyleId,
      selectedPerkIds,
      games: perksData[u.perks.games],
      bookmark: {
        src: '',
        meta: {
          pageType: key,
          champion
        },
        remote: {
          name: 'U.GG',
          id: 'ugg'
        }
      }
    };
  };
}

async function getDataSource(champion) {
  try {
    const lolVersions = await getJson(riotVersionEndpoint);
    const uGGStatsVersions = await getJson(uGGDataVersionsEndpoint);

    let lolVersion = lolVersions[0];
    let lolVersionUGG = getUGGFormattedLolVersion(lolVersion);

    if (!uGGStatsVersions[lolVersionUGG]) {
      lolVersion = lolVersions[1];
      lolVersionUGG = getUGGFormattedLolVersion(lolVersion);
    }

    const overviewVersion = "1.2.5"; // uGGStatsVersions[lolVersionUGG].overview;
    
    const championDataUrl = `https://static.u.gg/assets/lol/riot_static/${lolVersion}/data/en_US/champion/${champion}.json`;

    const championData = await getJson(championDataUrl);
    const championId = championData.data[champion].key;

    const championStatsUrl = `https://stats2.u.gg/lol/${uGGAPIVersion}/overview/${lolVersionUGG}/ranked_solo_5x5/${championId}/${overviewVersion}.json`;

    return getJson(championStatsUrl);
  } catch (e) {
    throw Error(e);
  }
}

async function updateBookmark(champion, pageId, callback) {
  try {
    const championStats = await getDataSource(champion);
    const page = extractPage(champion)(championStats[server][tier][pageId], pageId);
    delete page.games;
    callback(page);
  } catch (e) {
    callback({});
    throw Error(e);
  }
}

async function _getPages(champion, callback) {
  const runePages = { pages: {} };

  try {
    const championStats = await getDataSource(champion);

    let pages = map(championStats[server][tier], extractPage(champion));
    let totalGames = pages.reduce((total, current) => (total += current.games), 0);

    pages = pages.filter(page => {
      const positionPercentage = page.games / totalGames;
      delete page.games;
      return positionPercentage > 0.1;
    });

    pages.forEach(page => {
      runePages.pages[page.name] = page;
    });

    callback(runePages);
  } catch (e) {
    callback(runePages);
    throw Error(e);
  }
}

const plugin = {
  id: 'ugg',
  name: 'U.GG',
  active: true,
  bookmarks: true,
  getPages(champion, callback) {
    _getPages(champion, callback);
  },
  syncBookmark(bookmark, callback) {
    updateBookmark(bookmark.meta.champion, bookmark.meta.pageType, callback);
  }
};

module.exports = { plugin };
