module.exports = function(grunt) {
  var projectPath = '../projects/Enterprise';
  var destinationPath = '../../../ehi/multivariate-testing/Isobar'; //path to your ehi folder

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean : {
      options: {
        force: true
      },
      src: []
    },
    copy: {
      main: {
        files: []
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
        files: []
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('massmini', function(){
    var cfiles = [];
    var mfiles = [];
    var dfiles = [];

    grunt.file.expand(projectPath+'/**/**/*.html','!'+projectPath+'/**/dev/*.html','!'+projectPath+'/**/*.prod.html').forEach(function(filepath){

      var destFile = filepath.slice(0, filepath.lastIndexOf('/')+1) + 'dev/' + filepath.slice(filepath.lastIndexOf('/')+1, filepath.length);

      var minfile = filepath.slice(0, filepath.lastIndexOf('/')+1) + filepath.slice(filepath.lastIndexOf('/')+1, filepath.indexOf('.html'))+ '.prod.html';

      var cfile = {
        src : filepath,
        dest : destFile
      };

      var mfile = {
        src : filepath,
        dest : minfile
      };

      cfiles.push(cfile);
      mfiles.push(mfile);
      dfiles.push(filepath);

      /*grunt.log.write(filepath + '\n');
      grunt.log.write(destFile + '\n');
      grunt.log.write(minfile + '\n');
      grunt.log.write('\n');*/


    });

    grunt.config('copy.main.files', cfiles);
    grunt.config('htmlmin.dist.files', mfiles);
    grunt.config('clean.src', dfiles);

    grunt.task.run(['copy','htmlmin','clean']);
  });

};
