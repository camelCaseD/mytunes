// SongQueueEntryView.js - Defines a backbone view class for the song queue entries.
var SongQueueEntryView = Backbone.View.extend({
  initialize: function() {
    this.model.on('change:playCount', this.render, this);
  },

  tagName: 'li',

  template: _.template('<div class="container"><div class="title"><%= title %></div><div class="author">(<%= artist %>)</div><div class="play-count"><%= playCount %></div></div>'),

  render: function(){
    return this.$el.html(this.template(this.model.attributes));
  }
});
