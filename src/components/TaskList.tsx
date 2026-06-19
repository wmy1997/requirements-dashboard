import { useState } from 'react';
import type { Task } from '../types';
import './TaskList.css';

interface TaskListProps {
  tasks: Task[];
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskList({ tasks, onAdd, onToggle, onDelete }: TaskListProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setInput('');
  };

  const activeCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="task-list">
      <div className="task-list__header">
        <h3>任务列表</h3>
        {activeCount > 0 && (
          <span className="task-list__count">{activeCount} 个待完成</span>
        )}
      </div>

      <form className="task-list__form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="task-list__input"
          placeholder="添加新任务..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={100}
        />
        <button type="submit" className="task-list__add-btn" disabled={!input.trim()}>
          +
        </button>
      </form>

      {tasks.length === 0 ? (
        <p className="task-list__empty">还没有任务，添加一个吧</p>
      ) : (
        <ul className="task-list__items">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`task-list__item ${task.completed ? 'task-list__item--done' : ''}`}
            >
              <button
                className={`task-list__checkbox ${task.completed ? 'task-list__checkbox--checked' : ''}`}
                onClick={() => onToggle(task.id)}
                title={task.completed ? '取消完成' : '标记完成'}
              >
                {task.completed && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
              <span className="task-list__text">{task.text}</span>
              <button
                className="task-list__delete"
                onClick={() => onDelete(task.id)}
                title="删除"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
