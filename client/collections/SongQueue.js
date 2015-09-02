// SongQueue.js - Defines a backbone model class for the song queue.
var SongQueue = Songs.extend({

  initialize: function() {
    this.on('add', function() {
      if (this.length === 1) {
        this.playFirst();
      }
    }, this);

    this.on('ended', function() {
      this.at(0).dequeue();
      if (this.length > 0) {
        this.playFirst();
      }
    }, this);

    this.on('dequeue', function(song) {
      song.set('playCount', song.get('playCount') + 1);
      this.remove(song);
    }, this);
  },

  playFirst: function() {
    var song = this.at(0);
    song.play();
  }
});