module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    htmlmin: {
      dist: {
        options: {
          minifyCSS: true,
          minifyJS: true,
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{}]
      }
    },
    strip_code: {
      options: {
        patterns: [/ *isoTest\.log\([\w\S ]+\);?/g,/ *\/\/([\w\S ]+)?/g,/ *isoTest.debug = ([\w\S ]+)?;/g]
      },
      your_target: {
          files:[{}]
      }
    },
    watch: {
      files: ['../../../ehi/multivariate-testing/Isobar/**/**/*.html'], //path to your working folder
      tasks: ['strip_code','htmlmin'],
      options: {
        event: ['changed'],
        spawn: false
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-strip-code');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch']);

  grunt.event.on('watch', function(action, filepath, target) {
    var filename = filepath.slice(0,filepath.lastIndexOf('/')+1) + 'prod/' + filepath.slice(filepath.lastIndexOf('/')+1, filepath.lastIndexOf('.html')) + '.prod.html';

    grunt.config('strip_code.your_target.files.0.src', filepath);
    grunt.config('strip_code.your_target.files.0.dest', filename);

    grunt.config('htmlmin.dist.files.0.src', filename);
    grunt.config('htmlmin.dist.files.0.dest', filename);
  });

};
