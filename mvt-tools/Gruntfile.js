module.exports = function(grunt) {
  var projectPath = '../projects/Enterprise';
  var destinationPath = '../../../ehi/multivariate-testing/Isobar'; //path to your ehi folder

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      main: {
      }
    },
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
        patterns: [/ *isoTest\.log\([\w\S ]+\);?/g,/ *isoTest.debug = ([\w\S ]+)?;/g]
      },
      your_target: {
          files:[{}]
      }
    },
    watch: {
      files: [projectPath + '/**/**/*.html'],
      tasks: ['strip_code','htmlmin','copy'],
      options: {
        event: ['changed'],
        spawn: false
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-strip-code');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch']);

  grunt.event.on('watch', function(action, filepath, target) {
    var filename = filepath.slice(0,filepath.lastIndexOf('/dev/')+1) + filepath.slice(filepath.lastIndexOf('/')+1, filepath.lastIndexOf('.html')) + '.prod.html';
    var destFile = destinationPath + filename.slice(projectPath.length,filename.length);

    grunt.config('strip_code.your_target.files.0.src', filepath);
    grunt.config('strip_code.your_target.files.0.dest', filename);

    grunt.config('htmlmin.dist.files.0.src', filename);
    grunt.config('htmlmin.dist.files.0.dest', filename);

    grunt.config('copy.main.src', filename);
    grunt.config('copy.main.dest', destFile);
    grunt.config('copy.main.dest', 'currentFile.html');
  });

};
