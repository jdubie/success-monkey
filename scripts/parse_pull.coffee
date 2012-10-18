#!/usr/bin/env coffee

async      = require('async')
request    = require('request')
nodemailer = require('nodemailer')

class ParseData
  @APPLICATION_ID: 'QnnoX6Ep3ywvZEWgG52Zy4ZccBmlX4TkZjeQZzDP'
  @REST_API_KEY  : 'fA3oPlNgikE0BogeHY0coIyerbJIchv2mXg4GlZg'
  @PARSE_DOMAIN  : 'https://api.parse.com'

  @headers:
    'X-Parse-Application-Id': @APPLICATION_ID
    'X-Parse-REST-API-Key'  : @REST_API_KEY

  @GeneralClass: 'ReviewRequestGeneralObject'
  @TaskClass   : 'ReviewRequestTaskObject'

  getClassUrl: (klass) =>
    "#{@constructor.PARSE_DOMAIN}/1/classes/#{klass}"

  fetchGeneralFeedbackRequests: (callback) =>
    opts =
      url    : @getClassUrl(@constructor.GeneralClass)
      method : 'GET'
      json   : true
      headers: @constructor.headers
    request opts, (err, res, body) =>
      @generalFeedbackRequests = body.results if body?
      callback(err, @generalFeedbackRequests)

  fetchTaskFeedbackRequests: (callback) =>
    opts =
      url    : @getClassUrl(@constructor.TaskClass)
      method : 'GET'
      json   : true
      headers: @constructor.headers
    request opts, (err, res, body) =>
      @taskFeedbackRequests = body.results if body?
      callback(err, @taskFeedbackRequests)

  fetchFeedbackRequests: (callback) =>
    async.parallel [
      @fetchGeneralFeedbackRequests
      @fetchTaskFeedbackRequests
    ], (err, res) =>
      callback(err, {@generalFeedbackRequests, @taskFeedbackRequests})

  getUnsentFeedbackRequests: =>
    generalFeedbackRequests:
      xx for xx in @generalFeedbackRequests when not xx.emailSent
    taskFeedbackRequests:
      xx for xx in @taskFeedbackRequests when not xx.emailSent

class FeedbackMailer
  constructor: ->
    @mailer = nodemailer.createTransport('SMTP', {
      service: "Gmail"
      auth:
        user: process.env.GROUNDFLOOR_GMAIL_USER
        pass: process.env.GROUNDFLOOR_GMAIL_PASS
    })

  sendFeedbackRequest: (data, callback) =>
    opts =
      from: "GroundFloor Labs <#{process.env.GROUNDFLOOR_GMAIL_USER}>"
      to: "aotimme@stanford.edu"
      subject: "Feedback Request"
      text: "Alden is looking for feedback on something!"
    @mailer.sendMail opts, (err, res) =>
      console.log 'sendMail', err, res
      callback(err, res)

  done: =>
    @mailer.close()


parseData = new ParseData()
mailer = new FeedbackMailer()

async.series [
  (callback) ->
    parseData.fetchFeedbackRequests (err, requests) ->
      console.log requests
      callback()
# (callback) ->
#   mailer.sendFeedbackRequest(null, callback)
], (err, res) ->
  unsent = parseData.getUnsentFeedbackRequests()
  console.log 'unsent', unsent
  console.log 'DONE!'
  mailer.done()
