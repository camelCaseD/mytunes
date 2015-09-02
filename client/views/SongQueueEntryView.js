// SongQueueEntryView.js - Defines a backbone view class for the song queue entries.
var SongQueueEntryView = Backbone.View.extend({

  initialize: function() {
    this.model.on('change:playCount', this.render, this);
  },
  // your code here!

  tagName: 'tr',

  template: _.template('<td>(<%= artist %>)</td><td><%= title %></td><td><%= playCount %></td>'),

  render: function(){
    return this.$el.html(this.template(this.model.attributes));
  }

});
