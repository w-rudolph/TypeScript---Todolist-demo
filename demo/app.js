var TodosApp;
(function (TodosApp) {
    var TodoModel = (function () {
        function TodoModel(name) {
            this.name = name;
            this.completed = false;
            this.id = getUniqueID();
        }
        return TodoModel;
    }());
    var TodoModelCollection = (function () {
        function TodoModelCollection(models) {
            var _this = this;
            this.models = [];
            models.forEach(function (it) {
                var model = new TodoModel(it);
                _this.models.push(model);
            });
        }
        TodoModelCollection.prototype.addOne = function (model) {
            this.models.push(model);
            return this;
        };
        TodoModelCollection.prototype.remove = function (model) {
            var res = [];
            this.models.forEach(function (item) {
                if (item.id !== model.id) {
                    res.push(item);
                }
            });
            this.models = res;
            return this;
        };
        TodoModelCollection.prototype.getModelById = function (id) {
            var res = this.models.filter(function (item) { return item.id === id; });
            return res.length ? res[0] : void 0;
        };
        return TodoModelCollection;
    }());
    var TodoModelView = (function () {
        function TodoModelView(model) {
            this.model = model;
        }
        ;
        TodoModelView.prototype.render = function () {
            return "<li data-mid=\"" + this.model.id + "\" class=\"todo-item\"><span class=\"todo-name\">" + this.model.name + "</span><span class=\"remove\">x</span><span class=\"complete\">\u221A</span></li>";
        };
        return TodoModelView;
    }());
    var TodoView = (function () {
        function TodoView(arg) {
            this.collection = new TodoModelCollection(arg.collection);
            this.el = arg.el;
            this.render();
            this.bindEvents();
        }
        TodoView.prototype.render = function () {
            var _this = this;
            $(this.el).find('.todos').html("<ul class=\"todo-list\"></ul>");
            this.collection.models.forEach(function (todoModel) {
                var view = new TodoModelView(todoModel);
                _this.addOne(view);
            });
        };
        TodoView.prototype.bindEvents = function () {
            var _this = this;
            $(this.el).on('click', '.remove', function (e) {
                var cfm = confirm("Are you sure to remove this item?");
                if (!cfm)
                    return;
                var id = $(e.currentTarget).parent().data('mid');
                _this.removeOne(id);
                $(e.currentTarget).parent().remove();
                _this.completedProgress();
            });
            $(this.el).on('click', '.complete', function (e) {
                var id = $(e.currentTarget).parent().data('mid');
                var $view = $(_this.el).find("[data-mid=\"" + id + "\"]");
                $view.toggleClass('completed');
                _this.updateCompleted(id);
                _this.completedProgress();
            });
            $(this.el).on('click', '.todo-add .btn', function (e) {
                var $ipt = $(e.currentTarget).siblings('.input');
                var text = $.trim($ipt.val());
                if (!text)
                    return;
                var model = new TodoModel(text);
                $ipt.val("");
                _this.collection.addOne(model);
                var todoModeView = new TodoModelView(model);
                _this.addOne(todoModeView);
                _this.completedProgress();
            });
        };
        TodoView.prototype.addOne = function (view) {
            $(this.el).find('.todo-list').append(view.render());
            this.completedProgress();
        };
        TodoView.prototype.removeOne = function (id) {
            this.collection.remove(this.collection.getModelById(id));
        };
        TodoView.prototype.updateCompleted = function (id) {
            this.collection.models.forEach(function (todoModel) {
                if (todoModel.id === id) {
                    todoModel.completed = !todoModel.completed;
                    return;
                }
            });
        };
        TodoView.prototype.completedProgress = function () {
            var completed = [];
            var remaining = [];
            this.collection.models.forEach(function (item) {
                if (item.completed === true)
                    completed.push(item);
                else
                    remaining.push(item);
            });
            $(this.el).find('.todo-progress').html("<strong>Completed:<span class=\"completed-num\">" + completed.length + "</span> / Remaining:<span class=\"remaining-num\">" + remaining.length + "</span></strong>");
        };
        return TodoView;
    }());
    TodosApp.TodoView = TodoView;
    function getUniqueID() {
        return "M_" + guid();
    }
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    function guid() {
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
})(TodosApp || (TodosApp = {}));
//# sourceMappingURL=app.js.map