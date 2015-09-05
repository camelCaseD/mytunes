// PlayerView.js - Defines a backbone view class for the music player.
var PlayerView = Backbone.View.extend({

  // HTML5 (native) audio tag is being used
  // see: https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_HTML5_audio_and_video
  el: '<div class="player"><button class="camel-fab mdl-shadow--3dp"><i class="icon icon-av-black-ic_play_arrow_black_24dp"></i></button><div id="info"></div><div class="timeline"><div class="currentTimeInfo">0:00</div><div class="currentTime mdl-shadow--2dp"></div><div class="timeEplased"></div><div class="maxTimeInfo">0:00</div></div><audio autoplay /></div>',

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

  seeking: false,

  setSong: function(song) {
    this.model = song;
    this.render();
  },

  render: function() {
    var template = _.template('<h2><%= title %></h2><h5><%= artist %></h5>')
    this.$el.children('#info').html(template(this.model.attributes));

    interact('.currentTime').draggable({
      onstart: (function() {
        this.seeking = true;
        var $audio = this.$el.children('audio')[0];

        if (!$audio.paused) {
          this.model.pause();
          $audio.pause();
        }
      }).bind(this),

      onmove: this.seek.bind(this),

      onend: (function() {
        this.seeking = false;
        var $audio = this.$el.children('audio')[0];

        if ($audio.paused) {
          this.model.play();
          $audio.play();
        }
      }).bind(this)
    });

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
      this.$el.children('.timeline').children('.timeEplased').velocity('stop');
      this.$el.children('.timeline').children('.currentTime').velocity('stop');
    }
  },

  updateTimer: function() {
    var $audio = this.$el.children('audio')[0];
    var $timeEplased = this.$el.children('.timeline').children('.timeEplased');
    var $currentTime = this.$el.children('.timeline').children('.currentTime');
    var $currentTimeInfo = this.$el.children('.timeline')[0].children[0];

    if (!this.seeking) {
      var percentPlayed = Math.round($audio.currentTime / $audio.duration * 100);
      var barWidth = Math.ceil(percentPlayed * (800 / 100));

      $timeEplased.velocity({width: [barWidth + 'px', $timeEplased.width() + 'px']}, {duration: 999, easing: 'linear', queue: false});
      $currentTime.velocity({left: [barWidth + 'px', $currentTime.css('left')]}, {duration: 999, easing: 'linear', queue: false});
    }

    var minutes = Math.floor($audio.currentTime / 60);
    var seconds = Math.floor($audio.currentTime - minutes * 60);

    if (seconds < 10) {
      seconds = '0' + seconds;
    }

    $currentTimeInfo.innerText = minutes + ':' + seconds;

    var $maxTimeInfo = this.$el.children('.timeline')[0].children[3];

    var minutes = Math.floor($audio.duration / 60);
    var seconds = Math.floor($audio.duration - minutes * 60);

    if (seconds < 10) {
      seconds = '0' + seconds;
    }

    $maxTimeInfo.innerText = minutes + ':' + seconds;
  },

  seek: function(e) {
    var pos = {x: e.dx, y: e.dy};

    var $currentTime = this.$el.children('.timeline').children('.currentTime');
    var $timeEplased = this.$el.children('.timeline').children('.timeEplased');
    var currPosCT = parseFloat($currentTime.css('left'));
    var currPosTE = parseFloat($timeEplased.width());

    if (currPosCT + pos.x <= 790 && currPosCT + pos.x >= 0) {
      $currentTime.css('left', currPosCT + pos.x + 'px');
    }

    if (currPosTE + pos.x >= 0 && currPosTE + pos.x <= 800) {
      $timeEplased.css('width', currPosTE + pos.x + 'px');
    }

    var $audio = this.$el.children('audio')[0];
    var duration = $audio.duration;

    var percentSelected = $timeEplased.width() / 800;
    $audio.currentTime = percentSelected * duration;
  }

});
