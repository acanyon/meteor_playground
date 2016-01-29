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
  var refreshScore = function () {
    var score = Scores.findOne();
    Session.set('score', score);
  }

  Template.rps.onRendered(function () {
    refreshScore();
  });

  Template.rps.helpers({
    player1: function () {
      var score = Session.get('score');
      return score ? score.player1 : '';
    },

    player2: function () {
      var score = Session.get('score');
      return score ? score.player2 : '';
    }
  });

  Template.rps.events({
    'click .reset_game': function (event) {
      Scores.update(Session.get('score')._id, {player1: 0, player2: 0, pendingMove: null});
      setTimeout(function () { refreshScore(); }, 500);
    },

    'click .move_choices .move': function (event) {
      var MOVE_CHOICES = ['rock', 'paper', 'scissors'];
      var $moveButton = $(event.currentTarget);
      var $movesContainer = $moveButton.parent();
      if (!$movesContainer.hasClass('disabled')) {
        var playerIndex = ($moveButton.hasClass('player1') ? 'player1' : 'player2');
        var score = Session.get('score');
        var pendingMove = (score && score.pendingMove ? score.pendingMove : {});

        $moveButton.addClass('selected');
        $movesContainer.addClass('disabled');
        pendingMove[playerIndex] = $moveButton.data('movename');

        if (!pendingMove.player1 && !pendingMove.player2) {
          // find winner
          var newScore = {player1: score.player1, player2: score.player2};
          var scoreDelta = MOVE_CHOICES.indexOf(pendingMove.player1) - MOVE_CHOICES.indexOf(pendingMove.player2);
          if (scoreDelta === 0) {
            // tie
            newScore.player1 = score.player1 + 1;
            newScore.player2 = score.player2 + 1;
          } else if (scoreDelta === 1 || scoreDelta === -2) {
            // player 1
            newScore.player1 = score.player1 + 1;
          } else {
            // player 2
            newScore.player2 = score.player2 + 1;
          }
          pendingMove = {};

          $('.move.selected').removeClass('selected');
          $('.move_choices.disabled').removeClass('disabled')
          newScore.pendingMove = pendingMove;
          Scores.update(score._id, {$set: newScore},
            function () { refreshScore(); }
          );
        }
      }
    }
  });
}

if(Meteor.isServer) {
  Meteor.startup(function () {
    if (Scores.find().count() === 0) {
      Scores.insert({player1: 0, player2: 0});
    }
  });
}
