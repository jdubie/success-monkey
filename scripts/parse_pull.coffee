#!/usr/bin/env coffee

async   = require('async')
request = require('request')

APPLICATION_ID = 'QnnoX6Ep3ywvZEWgG52Zy4ZccBmlX4TkZjeQZzDP'
REST_API_KEY   = 'fA3oPlNgikE0BogeHY0coIyerbJIchv2mXg4GlZg'
PARSE_DOMAIN   = 'https://api.parse.com'

parseHeaders =
  'X-Parse-Application-Id': APPLICATION_ID
  'X-Parse-REST-API-Key'  : REST_API_KEY

CLASSES =
  general: 'ReviewRequestGeneralObject'
  task   : 'ReviewRequestTaskObject'

async.parallel
  general: (callback) ->
    opts =
      url    : "#{PARSE_DOMAIN}/1/classes/#{CLASSES.general}"
      method : 'GET'
      json   : true
      headers: parseHeaders
    request opts, (err, res, body) ->
      callback(err, body.results)
  task: (callback) ->
    opts =
      url    : "#{PARSE_DOMAIN}/1/classes/#{CLASSES.task}"
      method : 'GET'
      json   : true
      headers: parseHeaders
    request opts, (err, res, body) ->
      callback(err, body.results)
, (err, res) ->
  console.log 'res', res
