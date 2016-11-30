module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			options: {
			},
			dist: {
				files: {
					'css/main.css': 'scss/main.scss'
				}
			}
		},
		watch: {
		  sass: {
		    files: 'scss/**/*.scss',
		    tasks: ['sass']
		  }
		}
	});

	// Load dependencies
	grunt.registerTask('default', ["sass"]);
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-sass');
};
