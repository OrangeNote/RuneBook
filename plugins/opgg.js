const cheerio = require('cheerio');
const request = require('request');
const { upperFirst } = require('lodash');

const url = 'http://www.op.gg/champion/';

function extractRunePagesFromElement($, champion, position) {
  const getPerkIdFromImg = (_, elem) =>
    $(elem)
      .attr('src')
      .split('/')
      .slice(-1)
      .pop()
      .split('.')[0];

  return (runePageElement, index) => {
    const stats = $(runePageElement)
      .find('.champion-overview__stats strong')
      .map((i, elem) => $(elem).text())
      .get();

    const name = `${champion} ${upperFirst(position)} PR${stats[0]} WR${stats[1]}`;

    const styles = $(runePageElement)
      .find('.champion-overview__data .perk-page .perk-page__item--mark img')
      .map(getPerkIdFromImg)
      .get();

    const selectedPerkIds = $(runePageElement)
      .find('.champion-overview__data .perk-page .perk-page__item--active img')
      .map(getPerkIdFromImg)
      .get();

    return {
      name,
      primaryStyleId: styles[0],
      subStyleId: styles[1],
      selectedPerkIds,
      bookmark: {
        src: url + champion + '/statistics/' + position,
        meta: {
          pageType: index,
          champion
        },
        remote: {
          name: 'OP.GG',
          id: 'opgg'
        }
      }
    };
  };
}

function parsePage($, champion, position) {
  return $("tbody[class*='ChampionKeystoneRune-'] tr")
    .toArray()
    .map(extractRunePagesFromElement($, champion, position));
}

function parseSinglePage($, champion, position, pageType) {
  const element = $("tbody[class*='ChampionKeystoneRune-'] tr").get(pageType);
  return extractRunePagesFromElement($, champion, position)(element, pageType);
}

function extractPages(html, champion, callback) {
  const $ = cheerio.load(html);
  let pages = [];
  let initialPosition;

  const positions = $('.champion-stats-position li')
    .map((_, element) => {
      if (element.attribs['class'].indexOf('champion-stats-header__position--active') !== -1) {
        initialPosition = element.attribs['data-position'].toLowerCase();
      }

      return element.attribs['data-position'].toLowerCase();
    })
    .get();

  pages = pages.concat(parsePage($, champion, initialPosition));

  positions.splice(positions.indexOf(initialPosition), 1);

  if (positions.length) {
    positions.forEach((position, index) => {
      const opggUrl = url + champion + '/statistics/' + position;
      request.get(opggUrl, (error, response, newHtml) => {
        if (!error && response.statusCode === 200) {
          pages = pages.concat(parsePage(cheerio.load(newHtml), champion, position));
          if (index === positions.length - 1) {
            callback(pages);
          }
        }
      });
    });
  } else {
    callback(pages);
  }
}

function _getPages(champion, callback) {
  const runePages = { pages: {} };

  const entryChampUrl = url + champion;
  request.get(entryChampUrl, (error, response, html) => {
    if (!error && response.statusCode === 200) {
      extractPages(html, champion, pages => {
        pages.forEach(page => {
          runePages.pages[page.name] = page;
        });
        callback(runePages);
      });
    } else {
      callback(runePages);
      throw Error('rune page not loaded');
    }
  });
}

const plugin = {
  id: 'opgg',
  name: 'OP.GG',
  active: true,
  bookmarks: true,
  getPages(champion, callback) {
    _getPages(champion, callback);
  },
  syncBookmark(bookmark, callback) {
    request.get(bookmark.src, (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const position = bookmark.src.split('/').pop();
        callback(
          parseSinglePage(
            cheerio.load(html),
            bookmark.meta.champion,
            position,
            bookmark.meta.pageType
          )
        );
      } else {
        throw Error('rune page not loaded');
      }
    });
  }
};

module.exports = { plugin };
