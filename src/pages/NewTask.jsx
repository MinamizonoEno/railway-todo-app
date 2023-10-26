import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { url } from '../const';
import { Header } from '../components/Header';
import './newTask.scss';
import { useNavigate } from 'react-router-dom';

export const NewTask = () => {
  const [selectListId, setSelectListId] = useState();
  const [lists, setLists] = useState([]);
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [limitYear, setLimitYear] = useState(0);
  const [limitMonth, setLimitMonth] = useState(0);
  const [limitDay, setLimitDay] = useState(0);
  const [limitHour, setLimitHour] = useState(0);
  const [limitMinute, setLimitMinute] = useState(0);
  const [limitSecond, setLimitSecond] = useState(0);
  const [limit, setLimit] = useState(
    new Date(limitYear, limitMonth, limitDay, limitHour, limitMinute, limitSecond)
  );
  const [cookies] = useCookies();
  const history = useNavigate();
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDetailChange = (e) => {
    setDetail(e.target.value);
    handleLimitChange();
  };
  const handleLimitChange = () => {
    setLimit(new Date(limitYear, limitMonth - 1, limitDay, limitHour, limitMinute, limitSecond));
  };
  const handleLimitYearChange = (e) => {
    setLimitYear(e.target.value);
    handleLimitChange();
  };
  const handleLimitMonthChange = (e) => {
    setLimitMonth(e.target.value);
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
  const handleSelectList = (id) => setSelectListId(id);
  const onCreateTask = () => {
    handleLimitChange();
    const data = {
      title,
      detail,
      done: false,
      limit,
    };
    axios
      .post(`${url}/lists/${selectListId}/tasks`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        history('/');
      })
      .catch((err) => {
        setErrorMessage(`タスクの作成に失敗しました。${err}`);
      });
  };

  useEffect(() => {
    axios
      .get(`${url}/lists`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setLists(res.data);
        setSelectListId(res.data[0]?.id);
      })
      .catch((err) => {
        setErrorMessage(`リストの取得に失敗しました。${err}`);
      });
  }, []);

  return (
    <div>
      <Header />
      <main className="new-task">
        <h2>タスク新規作成</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="new-task-form">
          <label>リスト</label>
          <br />
          <select
            onChange={(e) => handleSelectList(e.target.value)}
            className="new-task-select-list"
          >
            {lists.map((list, key) => (
              <option key={key} className="list-item" value={list.id}>
                {list.title}
              </option>
            ))}
          </select>
          <br />
          <label>タイトル</label>
          <br />
          <input type="text" onChange={handleTitleChange} className="new-task-title" />
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
          <textarea type="text" onChange={handleDetailChange} className="new-task-detail" />
          <br />

          <button
            type="button"
            className="new-task-button"
            onClick={async () => {
              await handleLimitChange();
              await onCreateTask();
              console.log(limit);
            }}
          >
            作成
          </button>
        </form>
      </main>
    </div>
  );
};
