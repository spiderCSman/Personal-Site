/*
 * Todo — vanilla JS, no dependencies.
 *
 * One array is the source of truth. Every mutation goes through save(), which
 * persists and re-renders. The DOM is written to, never read from.
 */

const STORAGE_KEY = "clv.todo.v1";

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const empty = document.getElementById("todo-empty");
const count = document.getElementById("todo-count");
const clearBtn = document.getElementById("clear-completed");
const filterBtns = Array.from(document.querySelectorAll(".filter-btn"));

let todos = load();
let filter = "all";
let dragId = null;

/* ---------- persistence ---------- */

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Drop anything malformed rather than trusting stored shape.
    return parsed
      .filter((t) => t && typeof t.text === "string")
      .map((t) => ({
        id: typeof t.id === "string" ? t.id : makeId(),
        text: t.text.slice(0, 200),
        done: Boolean(t.done),
      }));
  } catch (err) {
    // Blocked storage, private mode, or corrupt JSON — start clean, keep working.
    return [];
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (err) {
    // Quota or blocked storage. In-memory state still works for this session.
  }
  render();
}

function makeId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/* ---------- rendering ---------- */

function visible() {
  if (filter === "active") return todos.filter((t) => !t.done);
  if (filter === "completed") return todos.filter((t) => t.done);
  return todos;
}

function render() {
  const rows = visible();
  list.replaceChildren(...rows.map(row));

  const remaining = todos.filter((t) => !t.done).length;
  const doneCount = todos.length - remaining;

  count.textContent =
    todos.length === 0
      ? "0 tasks"
      : `${remaining} left${doneCount ? ` · ${doneCount} done` : ""}`;

  clearBtn.hidden = doneCount === 0;

  if (rows.length === 0) {
    empty.hidden = false;
    empty.textContent =
      todos.length === 0
        ? "Nothing here yet. Add your first task above."
        : filter === "active"
          ? "No active tasks. Nicely done."
          : "Nothing completed yet.";
  } else {
    empty.hidden = true;
  }
}

function row(todo) {
  const li = document.createElement("li");
  li.className = "todo-item" + (todo.done ? " is-done" : "");
  li.dataset.id = todo.id;
  li.draggable = true;
  li.tabIndex = 0;

  const handle = document.createElement("span");
  handle.className = "drag-handle";
  handle.setAttribute("aria-hidden", "true");
  handle.textContent = "☰";

  const check = document.createElement("input");
  check.type = "checkbox";
  check.className = "todo-check";
  check.checked = todo.done;
  check.setAttribute("aria-label", `Mark "${todo.text}" as ${todo.done ? "not done" : "done"}`);

  const text = document.createElement("span");
  text.className = "todo-text";
  text.textContent = todo.text;
  text.title = "Double-click to edit";

  const del = document.createElement("button");
  del.type = "button";
  del.className = "todo-delete";
  del.setAttribute("aria-label", `Delete "${todo.text}"`);
  del.textContent = "×";

  li.append(handle, check, text, del);
  return li;
}

/* ---------- mutations ---------- */

function add(text) {
  const clean = text.trim();
  if (!clean) return;
  todos.unshift({ id: makeId(), text: clean.slice(0, 200), done: false });
  save();
}

function toggle(id) {
  const t = todos.find((x) => x.id === id);
  if (t) {
    t.done = !t.done;
    save();
  }
}

function remove(id) {
  todos = todos.filter((t) => t.id !== id);
  save();
}

function rename(id, text) {
  const clean = text.trim();
  const t = todos.find((x) => x.id === id);
  if (!t) return;
  if (!clean) {
    remove(id);
    return;
  }
  t.text = clean.slice(0, 200);
  save();
}

function move(id, delta) {
  const from = todos.findIndex((t) => t.id === id);
  const to = from + delta;
  if (from === -1 || to < 0 || to >= todos.length) return;
  const [item] = todos.splice(from, 1);
  todos.splice(to, 0, item);
  save();
  const el = list.querySelector(`[data-id="${id}"]`);
  if (el) el.focus();
}

function reorder(fromId, toId) {
  if (fromId === toId) return;
  const from = todos.findIndex((t) => t.id === fromId);
  const to = todos.findIndex((t) => t.id === toId);
  if (from === -1 || to === -1) return;
  const [item] = todos.splice(from, 1);
  todos.splice(to, 0, item);
  save();
}

/* ---------- inline editing ---------- */

function startEdit(li) {
  const id = li.dataset.id;
  const todo = todos.find((t) => t.id === id);
  const textEl = li.querySelector(".todo-text");
  if (!todo || !textEl) return;

  const field = document.createElement("input");
  field.type = "text";
  field.className = "todo-edit";
  field.value = todo.text;
  field.maxLength = 200;
  field.setAttribute("aria-label", "Edit task");

  let settled = false;
  const commit = () => {
    if (settled) return;
    settled = true;
    rename(id, field.value);
  };

  field.addEventListener("blur", commit);
  field.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      settled = true;
      render();
    }
  });

  textEl.replaceWith(field);
  field.focus();
  field.setSelectionRange(field.value.length, field.value.length);
}

/* ---------- events ---------- */

form.addEventListener("submit", (e) => {
  e.preventDefault();
  add(input.value);
  input.value = "";
  input.focus();
});

// One delegated listener for the entire list.
list.addEventListener("click", (e) => {
  const li = e.target.closest(".todo-item");
  if (!li) return;
  if (e.target.closest(".todo-delete")) remove(li.dataset.id);
  else if (e.target.matches(".todo-check")) toggle(li.dataset.id);
});

list.addEventListener("dblclick", (e) => {
  const li = e.target.closest(".todo-item");
  if (li && e.target.matches(".todo-text")) startEdit(li);
});

list.addEventListener("keydown", (e) => {
  const li = e.target.closest(".todo-item");
  if (!li || e.target.matches(".todo-edit")) return;

  if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
    e.preventDefault();
    move(li.dataset.id, e.key === "ArrowUp" ? -1 : 1);
  } else if (e.key === "Enter" && e.target === li) {
    e.preventDefault();
    startEdit(li);
  } else if ((e.key === "Delete" || e.key === "Backspace") && e.target === li) {
    e.preventDefault();
    remove(li.dataset.id);
  }
});

/* Drag to reorder */
list.addEventListener("dragstart", (e) => {
  const li = e.target.closest(".todo-item");
  if (!li) return;
  dragId = li.dataset.id;
  li.classList.add("is-dragging");
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", dragId);
  }
});

list.addEventListener("dragover", (e) => {
  e.preventDefault();
  const li = e.target.closest(".todo-item");
  if (!li || li.dataset.id === dragId) return;
  list.querySelectorAll(".is-drop-target").forEach((n) => n.classList.remove("is-drop-target"));
  li.classList.add("is-drop-target");
});

list.addEventListener("drop", (e) => {
  e.preventDefault();
  const li = e.target.closest(".todo-item");
  if (li && dragId) reorder(dragId, li.dataset.id);
  dragId = null;
});

list.addEventListener("dragend", () => {
  dragId = null;
  list.querySelectorAll(".is-dragging, .is-drop-target").forEach((n) =>
    n.classList.remove("is-dragging", "is-drop-target")
  );
});

clearBtn.addEventListener("click", () => {
  todos = todos.filter((t) => !t.done);
  save();
});

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filter = btn.dataset.filter;
    filterBtns.forEach((b) => {
      const on = b === btn;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", String(on));
    });
    render();
  });
});

// Keep multiple tabs in sync.
window.addEventListener("storage", (e) => {
  if (e.key === STORAGE_KEY) {
    todos = load();
    render();
  }
});

render();
