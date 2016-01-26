window.FormsEmbed = Backbone.View.extend
  defaults:
    screendoorBase: 'https://screendoor.dobt.co'

  initialize: (options) ->
    @projects = new Backbone.Collection
    @options = _.extend {}, @defaults, options
    @view = undefined
    @$el.text('Loading...')

    $.ajax
      url: "#{@options.screendoorBase}/api/public/sites/#{@options.site_id}/projects"
      data:
        v: 0
      success: (data) =>
        @projects.reset(data)
        @renderProjects()

  renderProjects: ->
    @showView(new ProjectsView(parent: @))

  renderForm: (projectId) ->
    @showView(new FormView(parent: @, project: @projects.get(projectId)))

  showView: (view) ->
    @view?.remove()
    @view = view
    @$el.html(view.render().el)

ProjectsView = Backbone.View.extend
  events:
    'click h3 > a': (e) ->
      @parent.renderForm($(e.target).data('project-id'))

  template: _.template """
    <ul class='projects'>
      <% projects.each(function(project){ %>
        <li>
          <h3><a href='#' data-project-id="<%= project.cid %>"><%= project.get('name') %></a></h3>
          <p><%= project.get('description') || 'No description' %></p>
        </li>
      <% }) %>
    </ul>
  """

  initialize: (options) ->
    { @parent } = options

  render: ->
    @$el.html @template(projects: @parent.projects)
    @

FormView = Backbone.View.extend
  events:
    'click .js-go-back': ->
      @parent.renderProjects()

  template: _.template """
    <p>
      <a class='js-go-back' href='#'>&larr; Back to all forms</a>
    </p>

    <div id='form'></div>
  """

  initialize: (options) ->
    { @parent, @project } = options

  render: ->
    @$el.html @template()

    new FormRenderer(
      target: @$el.find('#form')
      project_id: @project.get('embed_token')
      screendoorBase: @parent.options.screendoorBase
    )

    @
