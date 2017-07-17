(function () {
  "use strict";
  window.FourthWall = window.FourthWall || {};

  FourthWall.Reviews = Backbone.Model.extend({

    initialize: function () {
      this.on('change:ref', function () {
        this.fetch();
      }, this);
    },

    url: function () {
      return [
        this.get('baseUrl'),
        this.get('userName'),
        this.get('repo'),
        'pulls',
        this.get('pullId'),
        'reviews?per_page=100',
      ].join('/');
    },

    fetch: function() {
      return FourthWall.overrideFetch.call(this, this.get('baseUrl'));;
    },

    parse: function (response) {
      var data = response;
      var reviewers = {};

      for (var i = 0 ; i< data.length; i++) {
        var user = data[i].user.login

        if (user in reviewers) {
            var submitted_at = new Date(data[i].submitted_at)
            if (submitted_at.getTime() > reviewers[user].date.getTime()) {
                reviewers[user].date = submitted_at;
                reviewers[user].state = data[i].state;
            }
        }
        else {
            if (data[i].state != "COMMENTED") {
                submitted_at = new Date(data[i].submitted_at)
                reviewers[user] = {"state": data[i].state,
                                  "date": submitted_at
                                  }
            }
        }
      }
      return {reviewers};
    }
  });
}());
