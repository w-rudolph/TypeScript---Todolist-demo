declare var $;
namespace TodosApp {
    class TodoModel {
        name: string;
        completed: boolean;
        id: string;
        constructor(name: string) {
            this.name = name;
            this.completed = false;
            this.id = getUniqueID();
        }

    }
    class TodoModelCollection {
        models: TodoModel[];
        constructor(models: string[]) {
            this.models = [];
            models.forEach(it => {
                var model = new TodoModel(it);
                this.models.push(model);
            })
        }
        addOne(model: TodoModel) {
            this.models.push(model);
            return this;
        }
        remove(model: TodoModel) {
            this.models.splice(this.models.indexOf(model), 1);
            return this;
        }
        getModelById(id: string): TodoModel {
            var res = this.models.filter(item => item.id === id);
            return res.length ? res[0] : void 0;
        }
    }
    class TodoModelView {
        model: TodoModel;
        constructor(model: TodoModel) {
            this.model = model;
        };
        render() {
            return `<li data-mid="${this.model.id}" class="todo-item"><span class="todo-name">${this.model.name}</span><span class="remove">x</span><span class=\"complete\">√</span></li>`
        }
    }
    interface TodoArg {
        collection: any[];
        el: string
    }
    export class TodoView {
        collection: TodoModelCollection;
        el: string;
        constructor(arg: TodoArg) {
            this.collection = new TodoModelCollection(arg.collection);
            this.el = arg.el;
            this.render();
            this.bindEvents();
        }
        render() {
            $(this.el).find('.todos').html("<ul class=\"todo-list\"></ul>");
            this.collection.models.forEach(todoModel => {
                var view = new TodoModelView(todoModel);
                this.addOne(view);
            });
        }
        bindEvents() {
            $(this.el).on('click', '.remove', e => {
                var cfm = confirm("Are you sure to remove this item?");
                if (!cfm) return;
                var id = $(e.currentTarget).parent().data('mid');
                this.removeOne(id);
                $(e.currentTarget).parent().remove();
                this.completedProgress();
            })
            $(this.el).on('click', '.complete', e => {
                var id = $(e.currentTarget).parent().data('mid');
                var $view = $(this.el).find(`[data-mid="${id}"]`);
                $view.toggleClass('completed');
                this.updateCompleted(id);
                this.completedProgress();
            })
            $(this.el).on('click', '.todo-add .btn', e => {
                var $ipt = $(e.currentTarget).siblings('.input');
                var text = $.trim($ipt.val());
                if (!text) return;
                var model = new TodoModel(text);
                $ipt.val("");
                this.collection.addOne(model);
                var todoModeView = new TodoModelView(model);
                this.addOne(todoModeView);
                this.completedProgress();
            })
        }
        addOne(view: TodoModelView) {
            $(this.el).find('.todo-list').append(view.render());
            this.completedProgress();
        }
        removeOne(id: string) {
            this.collection.remove(this.collection.getModelById(id));
        }
        updateCompleted(id: string) {
            this.collection.models.forEach(todoModel => {
                if (todoModel.id === id) {
                    todoModel.completed = !todoModel.completed;
                    return;
                }
            });
        }
        completedProgress() {
            var completed: TodoModel[] = [];
            var remaining: TodoModel[] = [];
            this.collection.models.forEach(item => {
                if (item.completed === true) completed.push(item);
                else remaining.push(item);
            })
            $(this.el).find('.todo-progress').html(`<strong>Completed:<span class="completed-num">${completed.length}</span> / Remaining:<span class="remaining-num">${remaining.length}</span></strong>`);
        }
    }
    function getUniqueID(): string {
        return "M_" + guid();
    }
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    function guid() {
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
}
