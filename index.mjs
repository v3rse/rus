#!/usr/bin/env node

import Parser from 'rss-parser'
import cliHtml from 'cli-html'
import chroma from '@v3rse/chroma'

const parser = new Parser()

async function getFeed(source){
  const feed = await parser.parseURL(source)

  return feed
}

async function main(sources) {

 if (sources.length < 1) {
    console.error('no source urls passed\nusage: rus source-1 source-2')
 }


  const jobs = sources.map(async s => {
    const feed = await getFeed(s)

    console.log(chroma.bgmagenta(feed.title), '\n')

    feed.items.forEach((fi, i) => {
      let content
      try {
        content = cliHtml(fi['content'])
      } catch (error) {
        content = "unparsable content"
      }

      console.log(chroma.bold.green(`${i+1}) ${fi['title']} (by ${fi['creator']})`))
      console.log(`${content ?? ""}`)
      console.log(chroma.bold(`Link: ${fi['link']}`))
      console.log(chroma.bold(`Date: ${fi['pubDate']}`))
      console.log('\n')
    })
  })

  await Promise.all(jobs)
}

const {argv} = process

const [,, ...sources] = argv
main(sources).catch(console.error)
