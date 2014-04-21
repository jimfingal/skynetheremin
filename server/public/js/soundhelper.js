define(function() {

  var perfect_minor = [0, 1, 3, 5, 7, 8, 10, 12];
  var pentatonic = [0, 2, 4, 7, 9, 11];

  //var base_frequency = 440.0;
  var base_frequency = 523.25;
  var helper = {

    frequencyFromNote: function(n) {
      return Math.pow(2, n / 12) * base_frequency;
    },

    noteFromFrequency: function(f) {
      return Math.round(12 * Math.log(f / base_frequency) * Math.LOG2E, 0);
    },

    transposeNoteToScale: function(n, scale) {

      var scale_length = scale.length - 1;

      var octaves = Math.floor(n / scale_length);
      var leftover = n % scale_length;

      var note_in_scale = scale[leftover];

      return octaves * 12 + note_in_scale;
    },

    transposeNoteToPentatonicScale: function(n) {
      return this.transposeNoteToScale(n, pentatonic);
    },

    transposeNoteToMinorScale: function(n) {
      return this.transposeNoteToScale(n, perfect_minor);
    },

    fifthFromFrequency: function(freq) {
      return this.frequencyFromNote(this.noteFromFrequency(freq) + 8);
    }
  };
  
  return helper;

});
