// PlayerView.js - Defines a backbone view class for the music player.
var PlayerView = Backbone.View.extend({

  // HTML5 (native) audio tag is being used
  // see: https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_HTML5_audio_and_video
  el: '<div class="player"><button class="camel-fab mdl-shadow--3dp"><i class="icon icon-av-black-ic_play_arrow_black_24dp"></i></button><div id="info"></div><div class="timeline"><div class="currentTime mdl-shadow--2dp"></div><div class="timeEplased"></div></div><audio autoplay /></div>',

  initialize: function() {
    $(this.$el).on('ended', (function() {
      this.trigger('ended');
    }).bind(this));

    $(this.$el).children('audio').on('pause', this.togglePlayButton.bind(this));
    $(this.$el).children('audio').on('play', this.togglePlayButton.bind(this));
    $(this.$el).children('audio').on('timeupdate', this.updateTimer.bind(this));
  },

  events: {
    'click button': 'togglePlay'
  },

  setSong: function(song) {
    this.model = song;
    this.render();
  },

  render: function() {
    var template = _.template('<h2><%= title %></h2><h5><%= artist %></h5>')
    this.$el.children('#info').html(template(this.model.attributes));

    return this.$el.children('audio').attr('src', this.model ? this.model.get('url') : '');
  },

  togglePlayButton: function() {
    var audio = this.$el.children('audio')[0];
    var i = this.$el.children('.camel-fab')[0].children[0];

    if (audio.paused && audio.readyState === 4) {
      i.classList.remove('icon-av-black-ic_pause_black_24dp');
      i.classList.add('icon-av-black-ic_play_arrow_black_24dp');
    } else if (audio.readyState === 4) {
      i.classList.remove('icon-av-black-ic_play_arrow_black_24dp');
      i.classList.add('icon-av-black-ic_pause_black_24dp');
    }
  },

  togglePlay: function() {
    var audio = this.$el.children('audio')[0];

    if (audio.paused && audio.readyState === 4) {
      this.model.play();
      audio.play();
    } else if (audio.readyState === 4) {
      this.model.pause();
      audio.pause();
    }
  },

  updateTimer: function() {
    var $audio = this.$el.children('audio')[0];
    var $timeEplased = this.$el.children('.timeline')[0].children[0];
    var $currentTime = this.$el.children('.timeline')[0].children[1];

    var percentPlayed = Math.round($audio.currentTime / $audio.duration * 100);
    var barWidth = Math.ceil(percentPlayed * (800 / 100));

    // console.log(percentage / 800);

    $timeEplased.style.left = barWidth + 'px';
    $currentTime.style.width = barWidth + 'px';
  }

});
