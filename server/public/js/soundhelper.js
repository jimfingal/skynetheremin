define(function() {

  var perfect_minor = [0, 1, 3, 5, 7, 8, 10, 12];
  //var pentatonic = [0, 2, 4, 7, 9, 11];
  var pentatonic = [0, 7, 2, 9, 4, 11];

  var BASE_NOTE = 49; // A4
  var BASE_FREQUENCY = 440.0;

  var DEFAULT_NOTE = 52;

  var helper = {

    offset: function() {
      return DEFAULT_NOTE - BASE_NOTE;
    },

    frequencyFromNote: function(n) {
      return Math.pow(2, n / 12) * BASE_FREQUENCY;
    },

    noteFromFrequency: function(f) {
      return Math.round(12 * Math.log(f / BASE_FREQUENCY) * Math.LOG2E, 0);
    },

    transposeNoteToScale: function(n, scale) {

      var octaves, leftover, note_in_scale;
      var scale_length = scale.length - 1;

      if (n >= 0) {
        octaves = Math.floor(n / scale_length);
        leftover = n % scale_length;
        note_in_scale = scale[leftover];
      } else {
        octaves = -Math.floor(-n / scale_length);
        leftover = scale_length - (-n % scale_length);
        note_in_scale = scale[leftover] - 12; // start from an octave down
      }

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
