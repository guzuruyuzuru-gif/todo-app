import { auth } from './firebase.js';

import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';

// HTML要素
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

// ログイン状態の確認
onAuthStateChanged(auth, (user) => {
  if (user != null) {
    window.location.href = 'todo.html';
  }
});

// サインイン処理
loginForm.onsubmit = (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      console.log('サインイン成功');
      window.location.href = 'todo.html';
    })
    .catch((error) => {
      console.log('サインイン失敗:', error.code);

      errorMessage.textContent =
        'サインインに失敗しました。メールアドレスとパスワードを確認してください。';
    });
};
