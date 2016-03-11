module.exports = function (grunt) {
    grunt.initConfig({
        watch: {
            files: "assets/scss/**/*.scss",
            tasks: ['sass']
        },
        sass: {
            dist: {
                files: {
                  'assets/css/style.css': 'assets/scss/style.scss'
                }
            }
        },
        browserSync: {
            default_options: {
                bsFiles: {
                    src: [
                        "assets/css/*.css",
                        "*.html"
                    ]
                },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: "./"
                    }
                }
            }
        }
    });

    // load npm tasks
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-browser-sync');

    // define default task
    grunt.registerTask('default', ["browserSync", "watch"]);
};
