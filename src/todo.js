import { auth, db } from './firebase.js';

import { onAuthStateChanged, signOut } from 'firebase/auth';

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';

// HTML要素
const userEmail = document.getElementById('userEmail');
const logoutButton = document.getElementById('logoutButton');

const todoInput = document.getElementById('todoInput');
const addButton = document.getElementById('addButton');
const todoList = document.getElementById('todoList');

const allButton = document.getElementById('allButton');
const incompleteButton = document.getElementById('incompleteButton');
const completedButton = document.getElementById('completedButton');

// ログインユーザー
let currentUser = null;

// 表示切り替え
let currentFilter = 'all';

// ユーザー専用のitemsコレクション
function getTodoCollection() {
  return collection(db, 'todo', currentUser.uid, 'items');
}

// TODO一覧取得
async function loadTodos() {
  if (!currentUser) return;

  try {
    // TODO一覧を空にする
    while (todoList.firstChild) {
      todoList.removeChild(todoList.firstChild);
    }

    let q;

    // 表示するTODOを絞り込む
    if (currentFilter === 'incomplete') {
      q = query(getTodoCollection(), where('checked', '==', false));
    } else if (currentFilter === 'completed') {
      q = query(getTodoCollection(), where('checked', '==', true));
    } else {
      q = getTodoCollection();
    }

    const querySnapshot = await getDocs(q);

    for (const document of querySnapshot.docs) {
      const todo = document.data();

      createTodoElement(document.id, todo);
    }
  } catch (error) {
    console.log('TODO取得エラー:', error);
  }
}

// TODO表示
function createTodoElement(id, todo) {
  const li = document.createElement('li');

  li.style.display = 'flex';
  li.style.alignItems = 'center';
  li.style.gap = '10px';
  li.style.marginTop = '10px';
  li.style.padding = '12px';
  li.style.background = '#f1f5f9';
  li.style.borderRadius = '6px';

  // チェックボックス
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = todo.checked;

  // TODOタイトル
  const title = document.createElement('input');
  title.type = 'text';
  title.value = todo.title;
  title.style.flex = '1';
  title.style.minWidth = '0';

  if (todo.checked) {
    title.style.textDecoration = 'line-through';
    title.style.color = '#999';
  }

  // チェック状態の変更
  checkbox.addEventListener('change', async () => {
    try {
      await updateDoc(doc(getTodoCollection(), id), {
        checked: checkbox.checked,
      });

      await loadTodos();
    } catch (error) {
      console.log('チェック更新エラー:', error);
    }
  });

  // タイトルの編集
  title.addEventListener('change', async () => {
    const newTitle = title.value.trim();

    if (!newTitle) {
      alert('タイトルを入力してください');
      await loadTodos();
      return;
    }

    try {
      await updateDoc(doc(getTodoCollection(), id), {
        title: newTitle,
      });

      await loadTodos();
    } catch (error) {
      console.log('タイトル更新エラー:', error);
    }
  });

  // 削除ボタン
  const deleteButton = document.createElement('button');
  deleteButton.textContent = '×';
  deleteButton.style.background = '#ef4444';

  deleteButton.addEventListener('click', async () => {
    if (!confirm('削除しますか？')) return;

    try {
      await deleteDoc(doc(getTodoCollection(), id));

      await loadTodos();
    } catch (error) {
      console.log('削除エラー:', error);
    }
  });

  li.appendChild(checkbox);
  li.appendChild(title);
  li.appendChild(deleteButton);

  todoList.appendChild(li);
}

// TODO追加
async function addTodo() {
  const title = todoInput.value.trim();

  if (!title) {
    alert('TODOを入力してください');
    return;
  }

  if (!currentUser) return;

  try {
    await addDoc(getTodoCollection(), {
      checked: false,
      title: title,
      time: new Date(),
    });

    todoInput.value = '';

    await loadTodos();
  } catch (error) {
    console.log('TODO追加エラー:', error);
  }
}

// 追加ボタン
addButton.addEventListener('click', addTodo);

// Enterキーでも追加
todoInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTodo();
  }
});

// 全て表示
allButton.addEventListener('click', async () => {
  currentFilter = 'all';
  await loadTodos();
});

// 未完了だけ表示
incompleteButton.addEventListener('click', async () => {
  currentFilter = 'incomplete';
  await loadTodos();
});

// 完了だけ表示
completedButton.addEventListener('click', async () => {
  currentFilter = 'completed';
  await loadTodos();
});

// サインアウト
logoutButton.addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      console.log('サインアウト成功');
      window.location.href = 'index.html';
    })
    .catch((error) => {
      console.log('サインアウト失敗:', error.code);
    });
});

// ログイン状態の確認
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;

    console.log(user.uid);

    userEmail.textContent = user.email;

    loadTodos();
  } else {
    window.location.href = 'index.html';
  }
});
