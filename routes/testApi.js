var express = require('express');
var router = express.Router();
const axios = require('axios');
const fetch = require('node-fetch');
const superagent = require('superagent');
const cheerio = require('cheerio')
const cors_url = "https://cors-anywhere.herokuapp.com/"
const host = "https://plastic-workers.herokuapp.com"

router.get('/', async function(req, res, next) {
    // console.log(req)
    const { url } = req.query
    let output = {
        images:[],
        name: '',
        desc: []
    }
    output.link=url
    await superagent.get(url).then(data=>{
        // output.html=data.text
        let $ = cheerio.load(data.text)
        $("span[id='productTitle']").each(function (i, element) {
            let name = $(this).prepend().text().trim()
            output.name = name
        })
        $("div[class='imgTagWrapper']")
        .find('img')
        .each(function (i, element) {
          let src = $(this).attr('data-old-hires').trim()
          if (src) {
            output.images.push(src)
          } else {
            output.images.push($(this).attr('src').trim())
          }
        })
        $("div[id='feature-bullets']")
        .find('li > span')
        .each(function (i, element) {
          let text = $(this).text().trim()
          if (text) {
            output.desc.push(text)
          }
        })


    }).catch(err=>{
      console.error(err)
      res.status(500).json(err.ressponse.data)
    });
    res.json(output);
});

module.exports = router;
