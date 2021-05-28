import { types } from 'mobx-state-tree'

export const UploadsManagerStore = types
  .model('TodoStore', {
    todos: types.array(types.string),
  })
  .views((self) => ({
    get count() {
      return self.todos.length
    },
  }))
  // .volatile((self) => ({
  //   newTodoTitle: '',
  // }))
  .actions((self) => ({
    addTodo(title: string) {
      self.todos.push(title)
    },
  }))
