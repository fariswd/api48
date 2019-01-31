const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

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
          const title = cheerio
            .load(l)('b')
            .text();

          const img = cheerio
            .load(l)('img')
            .attr().src;

          const link = [];
          cheerio
            .load(l)('a')
            .each((i, e) => {
              link.push({
                ...e.attribs,
                title: e.children[0].data || null
              });
            });

          content.push({
            title,
            img,
            link
          });
        });

        sisterGroup[id].content = content;

        id += 1;
      }
    });

    const json = JSON.stringify(sisterGroup);
    fs.writeFile('response-result.json', json, 'utf8', err => {
      if (err) {
        console.log('error write response-result.json');
      } else {
        console.log('success write response-result.json');
      }
    });
  } catch (err) {
    console.log('something goes wrong: ', err);
  }
};

main();
