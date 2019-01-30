const axios = require('axios');
const cheerio = require('cheerio');

const mainPage = 'http://stage48.net/wiki/index.php/Main_Page';

const main = async () => {
  try {
    const { data } = await axios.get(mainPage);
    const s = cheerio.load(data);
    let id = 0;

    const sisterGroup = [];

    const header = [];
    s('#mw-content-text')
      .children()
      .each((i, e) => {
        header.push(cheerio.html(e));
      });
    header.forEach(h => {
      const load = cheerio.load(h);

      if (load('h3').length === 1) {
        sisterGroup[id] = { name: load.text() };
      }

      if (load('span').length > 1) {
        const sisters = [];
        const content = [];

        load('span').each((i, e) => {
          sisters.push(cheerio.html(e));
        });

        sisters.forEach(l => {
          const img = cheerio
            .load(l)('img')
            .attr();

          const link = [];
          cheerio
            .load(l)('a')
            .each((i, e) => {
              link.push(e.attribs);
            });

          content.push({
            img,
            link
          });
        });

        sisterGroup[id].content = content;

        id += 1;
      }
    });

    console.log(JSON.stringify(sisterGroup));
  } catch (err) {
    console.log('something goes wrong: ', err);
  }
};

main();
