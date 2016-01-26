module.exports = (grunt) ->
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-contrib-watch')

  grunt.initConfig
    pkg: '<json:package.json>'

    coffee:
      all:
        src: 'src/forms_embed.coffee'
        dest: 'dist/forms_embed.js'

    watch:
      all:
        files: ['src/**/*']
        tasks: 'default'

  grunt.registerTask 'default', ['coffee:all']
