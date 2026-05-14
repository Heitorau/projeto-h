const API = "SUA_URL";

let currentUser = null;

async function api(data) {
  const req = await fetch(API, {
    method: "POST",
    body: JSON.stringify(data)
  });

  return req.json();
}

async function register() {
  const username =
    document.getElementById("username").value;

  const password =
    document.getElementById("password").value;

  const res = await api({
    action: "register",
    username,
    password
  });

  alert(res.message || "Registrado!");
}

async function login() {
  const username =
    document.getElementById("username").value;

  const password =
    document.getElementById("password").value;

  const res = await api({
    action: "login",
    username,
    password
  });

  if (res.success) {
    currentUser = res.user;

    document.querySelector(".login")
      .classList.add("hidden");

    document.querySelector(".app")
      .classList.remove("hidden");

    loadPosts();

  } else {
    alert(res.message);
  }
}

async function createPost() {
  const texto =
    document.getElementById("texto").value;

  const media =
    document.getElementById("media").value;

  const tipo =
    document.getElementById("tipo").value;

  await api({
    action: "createPost",
    username: currentUser.username,
    texto,
    media,
    tipo
  });

  document.getElementById("texto").value = "";
  document.getElementById("media").value = "";

  loadPosts();
}

async function loadPosts() {
  const posts = await api({
    action: "getPosts"
  });

  const feed = document.getElementById("feed");

  feed.innerHTML = "";

  posts.forEach(post => {

    const div = document.createElement("div");

    div.className = "post";

    div.innerHTML = `
      <h3>@${post.username}</h3>
      <p>${post.texto}</p>

      ${
        post.tipo === "image"
        ? `<img src="${post.media}">`
        : `<video controls src="${post.media}"></video>`
      }

      <button onclick="likePost('${post.id}')">
        ❤️ ${post.likes}
      </button>
    `;

    feed.appendChild(div);
  });
}

async function likePost(id) {
  await api({
    action: "likePost",
    id
  });

  loadPosts();
}