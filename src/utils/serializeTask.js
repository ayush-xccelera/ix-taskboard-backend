/**
 * DTO mapper: converts a raw `tasks` DB row (snake_case columns) into the
 * public JSON wire shape (camelCase). Keeping this separate from the model
 * means the storage shape and the API shape can evolve independently.
 *
 * @param {{id:number,title:string,description:?string,priority:string,completed:boolean,created_at:Date}} row
 * @returns {{id:number,title:string,description:?string,priority:string,completed:boolean,createdAt:Date}}
 */
function serializeTask(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    priority: row.priority,
    completed: row.completed,
    createdAt: row.created_at,
  };
}

module.exports = serializeTask;
