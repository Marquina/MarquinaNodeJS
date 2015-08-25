var Twit = require('twit')
  jsonfile = require('jsonfile')
  notifier = require('node-notifier'),
  fav_users = [],
  fav_keywords = [],
  tokens = {};

jsonfile.readFile('config.json', function(err, config) {
  fav_users = config.fav_users;
  fav_keywords = config.fav_keywords;
  tokens = config.tokens;
  startProcessingStream();
});

function startProcessingStream() {

  var T = new Twit(tokens);

  var statusStream = T.stream('statuses/filter', {
    follow: fav_users
  });

  statusStream.on('tweet', function(tweet) {
    var newTweet = tweet.retweeted_status || tweet;
    if (!newTweet.in_reply_to_status_id && !newTweet.in_reply_to_user_id && !newTweet.in_reply_to_screen_name) {
      console.log('@' + newTweet.user.screen_name + ' tweeted.');
      console.log(newTweet.text);
      if (!new RegExp(fav_keywords.join('|'), 'gi').test(newTweet.text)) {
        console.log('No status update. Did not pass sanity check.')
        console.log('-----');
        return;
      }
      T.post('statuses/update', {
        status: newTweet.text
      }, function(err, data, response) {
        if (err) {
          console.log('Error updating status' + err.message)
          console.log('-----');
          return;
        }
        notifier.notify({
          'title': '@' + newTweet.user.screen_name + ' tweeted.',
          'message': newTweet.text
        });
        console.log('Status updated successfully. ' + new Date());
        console.log('-----');
      });
    }
  });

  statusStream.on('error', function (err) {
    console.log('ERROR: ' + err.message);
  });

}
