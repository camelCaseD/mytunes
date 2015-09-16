// SongQueue.js - Defines a backbone model class for the song queue.
var SongQueue = Songs.extend({

  initialize: function() {
    this.on('add', function() {
      if (this.length === 1) {
        this.playFirst();
      }
    }, this);

    this.on('ended', this.dequeue, this);

    this.on('dequeue', this.dequeue, this);
  },

  playFirst: function() {
    this.at(0).play();
  },

  dequeue: function() {
    this.remove(this.at(0));

    if (this.length > 0) {
      this.playFirst();
    }

    return this.at(0);
  }

});
