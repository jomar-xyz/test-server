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
        desc: [],
        brand: ''
    }
    output.link=url
    await superagent.get(url).then(data=>{
        // output.html=data.text
        // output.html = data.text
        let $ = cheerio.load(data.text)
        if(url.includes('www.amazon.com')){
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
          $("div[id='productDescription']")
          .find('p')
          .each(function (i, element) {
            let text = $(this).text().trim()
            if (text) {
              output.desc.push(text)
            }
          })
          var brand = $('td').filter(function() {
            return $(this).text().trim() === 'Brand';
          }).next().text().trim();
          if(brand){
            output.brand=brand
          }
          console.log("brand===>",brand)

        }else{
            let name = $("meta[name='og:title']").attr('content') || $("meta[property='og:title']").attr('content')
            if(name){
              output.name = name
            }
            let desc = $("meta[property='og:description']").attr('content') || $("meta[name='og:description']").attr('content')
            if(desc){
              output.desc.push(desc)
            }
            let image = $("meta[property='og:image']").attr('content') || $("meta[name='og:image']").attr('content')
            if(image){
                if(image.includes('https://')){
                  output.images.push(image)
                }else{
                  if(image.includes('//')){
                    output.images.push(image.replace('//', 'https://'))
                  }
                }
            }
            
          
          console.log("done")
        }


    }).catch(err=>{
      console.error(err)
      res.status(500).json(err.response.data)
    });
    res.json(output);
});

module.exports = router;
