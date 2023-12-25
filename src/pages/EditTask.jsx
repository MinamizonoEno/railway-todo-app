import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { url } from '../const';
import { useNavigate, useParams } from 'react-router-dom';
import './editTask.scss';

export const EditTask = () => {
  const history = useNavigate();
  const { listId, taskId } = useParams();
  const [cookies] = useCookies();
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [isDone, setIsDone] = useState();
  const [limitYear, setLimitYear] = useState(0);
  const [limitMonth, setLimitMonth] = useState(0);
  const [limitDay, setLimitDay] = useState(0);
  const [limitHour, setLimitHour] = useState(0);
  const [limitMinute, setLimitMinute] = useState(0);
  const [limitSecond, setLimitSecond] = useState(0);
  const [limit, setLimit] = useState(
    new Date(limitYear, limitMonth, limitDay, limitHour, limitMinute, limitSecond)
  );
  const [errorMessage, setErrorMessage] = useState('');
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDetailChange = (e) => {
    setDetail(e.target.value);
    handleLimitChange();
  };
  const handleIsDoneChange = (e) => setIsDone(e.target.value === 'done');
  const handleLimitChange = () => {
    setLimit(new Date(limitYear, limitMonth - 1, limitDay, limitHour, limitMinute, limitSecond));
  };
  const handleLimitYearChange = (e) => {
    setLimitYear(e.target.value);
    handleLimitChange();
  };
  const handleLimitMonthChange = (e) => {
    setLimitMonth(e.target.value);
    handleLimitChange();
  };
  const handleLimitDayChange = (e) => {
    setLimitDay(e.target.value);
    handleLimitChange();
  };
  const handleLimitHourChange = (e) => {
    setLimitHour(e.target.value);
    handleLimitChange();
  };
  const handleLimitMinuteChange = (e) => {
    setLimitMinute(e.target.value);
    handleLimitChange();
  };
  const handleLimitSecondChange = (e) => {
    setLimitSecond(e.target.value);
    handleLimitChange();
  };
  const onUpdateTask = () => {
    console.log(isDone);
    console.log(limit);
    const data = {
      title,
      detail,
      done: isDone,
      limit: limit,
    };

    axios
      .put(`${url}/lists/${listId}/tasks/${taskId}`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        history('/');
      })
      .catch((err) => {
        setErrorMessage(`更新に失敗しました。${err}`);
      });
  };

  const onDeleteTask = () => {
    axios
      .delete(`${url}/lists/${listId}/tasks/${taskId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        history('/');
      })
      .catch((err) => {
        setErrorMessage(`削除に失敗しました。${err}`);
      });
  };

  useEffect(() => {
    axios
      .get(`${url}/lists/${listId}/tasks/${taskId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        const task = res.data;
        setTitle(task.title);
        setDetail(task.detail);
        setIsDone(task.done);
        setLimit(task.limit);
        const limitDates = new Date(task.limit);
        setLimitYear(limitDates.getFullYear());
        setLimitMonth(limitDates.getMonth() + 1);
        setLimitDay(limitDates.getDate());
        setLimitHour(limitDates.getHours());
        setLimitMinute(limitDates.getMinutes());
        setLimitSecond(limitDates.getSeconds());
      })
      .catch((err) => {
        setErrorMessage(`タスク情報の取得に失敗しました。${err}`);
      });
  }, []);

  return (
    <div>
      <Header />
      <main className="edit-task">
        <h2>タスク編集</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="edit-task-form">
          <label>タイトル</label>
          <br />
          <input
            type="text"
            onChange={handleTitleChange}
            className="edit-task-title"
            value={title}
          />
          <br />
          <label>期限</label>
          <br />
          <input
            type="text"
            onChange={handleLimitYearChange}
            value={limitYear}
            className="new-task-limit"
          />
          <label>年</label>
          <input
            type="text"
            onChange={handleLimitMonthChange}
            value={limitMonth}
            className="new-task-limit"
          />
          <label>月</label>
          <input
            type="text"
            onChange={handleLimitDayChange}
            value={limitDay}
            className="new-task-limit"
          />
          <label>日</label>
          <input
            type="text"
            onChange={handleLimitHourChange}
            value={limitHour}
            className="new-task-limit"
          />
          <label>時</label>
          <input
            type="text"
            onChange={handleLimitMinuteChange}
            value={limitMinute}
            className="new-task-limit"
          />
          <label>分</label>
          <input
            type="text"
            onChange={handleLimitSecondChange}
            value={limitSecond}
            className="new-task-limit"
          />
          <label>秒</label>
          <br />
          <label>詳細</label>
          <br />
          <textarea
            type="text"
            onChange={handleDetailChange}
            className="edit-task-detail"
            value={detail}
          />
          <br />

          <div>
            <input
              type="radio"
              id="todo"
              name="status"
              value="todo"
              onChange={handleIsDoneChange}
              checked={isDone === false ? 'checked' : ''}
            />
            未完了
            <input
              type="radio"
              id="done"
              name="status"
              value="done"
              onChange={handleIsDoneChange}
              checked={isDone === true ? 'checked' : ''}
            />
            完了
          </div>
          <button type="button" className="delete-task-button" onClick={onDeleteTask}>
            削除
          </button>
          <button
            type="button"
            className="edit-task-button"
            onClick={async () => {
              await handleLimitChange();
              await onUpdateTask();
              console.log(limit);
            }}
          >
            更新
          </button>
        </form>
      </main>
    </div>
  );
};
