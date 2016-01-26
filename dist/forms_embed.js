(function() {
  var FormView, ProjectsView;

  window.FormsEmbed = Backbone.View.extend({
    defaults: {
      screendoorBase: 'https://screendoor.dobt.co'
    },
    initialize: function(options) {
      this.projects = new Backbone.Collection;
      this.options = _.extend({}, this.defaults, options);
      this.view = void 0;
      this.$el.text('Loading...');
      return $.ajax({
        url: this.options.screendoorBase + "/api/public/sites/" + this.options.site_id + "/projects",
        data: {
          v: 0
        },
        success: (function(_this) {
          return function(data) {
            _this.projects.reset(data);
            return _this.renderProjects();
          };
        })(this)
      });
    },
    renderProjects: function() {
      return this.showView(new ProjectsView({
        parent: this
      }));
    },
    renderForm: function(projectId) {
      return this.showView(new FormView({
        parent: this,
        project: this.projects.get(projectId)
      }));
    },
    showView: function(view) {
      var ref;
      if ((ref = this.view) != null) {
        ref.remove();
      }
      this.view = view;
      return this.$el.html(view.render().el);
    }
  });

  ProjectsView = Backbone.View.extend({
    events: {
      'click h3 > a': function(e) {
        return this.parent.renderForm($(e.target).data('project-id'));
      },
      'click .js-show-description': function(e) {
        return $(e.target).closest('li').find('.js-description-toggle').toggle();
      }
    },
    template: _.template("<ul class='projects'>\n  <% projects.each(function(project){ %>\n    <li>\n      <h3><a href='#' data-project-id=\"<%= project.cid %>\"><%= project.get('name') %></a></h3>\n      <small class='js-description-toggle'><a href='#' class='js-show-description'>Show description</a></small>\n      <div style='display:none;' class='js-description-toggle'><%= project.get('description') || 'No description' %></div>\n    </li>\n  <% }) %>\n</ul>"),
    initialize: function(options) {
      return this.parent = options.parent, options;
    },
    render: function() {
      this.$el.html(this.template({
        projects: this.parent.projects
      }));
      return this;
    }
  });

  FormView = Backbone.View.extend({
    events: {
      'click .js-go-back': function() {
        return this.parent.renderProjects();
      }
    },
    template: _.template("<p>\n  <a class='js-go-back' href='#'>&larr; Back to all forms</a>\n</p>\n\n<div id='form'></div>"),
    initialize: function(options) {
      return this.parent = options.parent, this.project = options.project, options;
    },
    render: function() {
      this.$el.html(this.template());
      new FormRenderer({
        target: this.$el.find('#form'),
        project_id: this.project.get('embed_token'),
        screendoorBase: this.parent.options.screendoorBase
      });
      return this;
    }
  });

}).call(this);
