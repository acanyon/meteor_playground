"use strict";

var Scores = new Meteor.Collection("scores");

Router.route('/', function () {
  this.render('Home', {});
});

Router.route('/player1', function () {
  this.render('rps', {playerIndex: 0});
});

Router.route('/player2', function () {
  this.render('rps', {playerIndex: 1});
});

if (Meteor.isClient) {
  // score starts at 0
  var _globalScore = Scores.findOne();
  var _allScores = Scores.find();
  Session.setDefault('currentMove', [null, null]);

  var refreshScore = function () {
    var didChange = false;
    var newScore = Scores.findOne();
    if (_globalScore[0] !== newScore[0] && _globalScore[1] !== newScore[1]) {
      _globalScore = newScore;
      didChange = true;
    }
    return didChange;
  }


  Template.rps.helpers({
    player1: function () {
      return _globalScore[0];
    },

    player2: function () {
      return _globalScore[1];
    }
  });

  Template.rps.events({
    'click .move_choices .move': function (event) {
      var MOVE_CHOICES = ['rock', 'paper', 'scissors'];
      var $moveButton = $(event.currentTarget);
      var $movesContainer = $moveButton.parent();
      if (!$movesContainer.hasClass('disabled')) {
        var playerIndex = ($moveButton.hasClass('player1') ? 0 : 1);
        var score = _globalScore;
        var currentMove = Session.get('currentMove');

        $moveButton.addClass('selected');
        $movesContainer.addClass('disabled');
        currentMove[playerIndex] = $moveButton.data('movename');

        if (currentMove[0] !== null && currentMove[1] !== null) {
          // find winner
          var newScore = [score[0], score[1]];
          var scoreDelta = MOVE_CHOICES.indexOf(currentMove[0]) - MOVE_CHOICES.indexOf(currentMove[1]);
          if (scoreDelta === 0) {
            // tie
            newScore[0] = score[0] + 1;
            newScore[1] = score[1] + 1;
          } else if (scoreDelta === 1 || scoreDelta === -2) {
            // player 1
            newScore[0] = score[0] + 1;
          } else {
            // player 2
            newScore[1] = score[1] + 1;
          }
          currentMove = [null, null];

          $('.move.selected').removeClass('selected');
          $('.move_choices.disabled').removeClass('disabled')
          Scores.update({_id: score._id}, {$set: {score: newScore}});
          refreshScore();
          debugger;
        }

        Session.set('currentMove', currentMove);
      }
    }
  });
}

if(Meteor.isServer) {
  Meteor.startup(function () {
    if (Scores.find().count() === 0) {
      Scores.insert({score: [0, 0]});
    }
  });

  Meteor.methods({
    score: function (newscore) {
      return Scores.find({});
      var score = Scores.find()[0];
      if (newscore) {
        Scores.update(score.id, {score: newscore});
      }
      return score.score;
    }
  });
}
