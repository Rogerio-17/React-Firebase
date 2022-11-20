import { useState, useEffect, cloneElement } from "react";
import { db, auth } from "./firebaseConnection";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import Header from "./components/header";

import "./app.css";
import { async } from "@firebase/util";
import { wait } from "@testing-library/user-event/dist/utils";

function App() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [idPost, setIdPost] = useState("");

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [posts, setPosts] = useState([]);

  const [user, setUser] = useState(false);
  const [detail, setDetail] = useState({});

  useEffect(() => {
    async function loadPosts() {
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
        let listaPost = [];

        snapshot.forEach((doc) => {
          listaPost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          });
        });

        setPosts(listaPost);
      });
    }
    loadPosts();
  }, []);

  useEffect(() => {
    async function checkLogin() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(true);
          setDetail({
            email: user.email,
          });
        } else {
          setUser(false);
          setDetail({});
        }
      });
    }
    checkLogin();
  }, []);

  async function handleAdd() {
    // await setDoc(doc(db, "posts", "1234"), {
    //   titulo: titulo,
    //   autor: autor,
    // })
    //   .then(() => {
    //     alert("Dados cadastrados com sucesso");
    //   })

    //   .catch((error) => {
    //     alert("Gerou erro" + error);
    //   });

    await addDoc(collection(db, "posts"), {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        alert("Dados cadastrados com sucesso");
        setAutor("");
        setTitulo("");
      })

      .catch((error) => {
        alert("Gerou erro" + error);
      });
  }

  async function buscarPost() {
    // const postRef = doc(db, "posts", "123");

    // await getDoc(postRef)
    //   .then((snapshot) => {
    //     setAutor(snapshot.data().autor);
    //     setTitulo(snapshot.data().titulo);
    //   })

    //   .catch((error) => {
    //     alert("Gerou erro" + error);
    //   });

    const postRef = collection(db, "posts");

    await getDocs(postRef)
      .then((snapshot) => {
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          });
        });

        setPosts(lista);
      })

      .catch((error) => {
        alert("Gerou erro" + error);
      });
  }

  async function edit() {
    const docRef = doc(db, "posts", idPost);
    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        alert("Alterações realizadas com sucesso");
        setIdPost("");
        setTitulo("");
        setAutor("");
      })

      .catch(() => {
        alert("Foi identificado o erro");
      });
  }

  async function excluir(id) {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef)
      .then(() => {
        alert("post deletado com sucesso");
      })
      .catch(() => {
        alert("Erro ao deletar o post");
      });
  }

  async function novoUsuario() {
    await createUserWithEmailAndPassword(auth, email, senha)
      .then(() => {
        alert("cadastrado com sucesso");
        setEmail("");
        setSenha("");
      })

      .catch((error) => {
        if (error.code === "auth/weak-password") {
          alert("senha muito fraca");
        } else if (error.code === "auth/email-already-in-use") {
          alert("Email já existe");
        }
      });
  }

  async function logarUser() {
    await signInWithEmailAndPassword(auth, email, senha)
      .then((value) => {
        alert("Usuario logado");
        setEmail("");
        setSenha("");

        setDetail({
          email: value.user.email,
        });
        setUser(true);
      })
      .catch(() => {
        alert("Erro ao logar usuario");
      });
  }

  async function deslogar() {
    await signOut(auth)
      .then(() => {
        alert("Usuario deslogado");

        setUser(false);
        setDetail({});
      })

      .catch(() => {
        alert("Erro ao deslogar usuario");
      });
  }

  return (
    <div className="App">
      <Header />
      <div className="container">
        {user && (
          <div>
            <strong>Seja bem-vindo(a) você está logado!</strong>
            <br />
            <span>Seu email é {detail.email}</span>
            <br />
            <button className="button-login" onClick={deslogar}>
              Deslogar
            </button>
          </div>
        )}

        <laber>Email:</laber>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu email"
        />

        <laber>Senha:</laber>
        <input
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Digite sua senha"
        />
        <br />

        <button className="button-login" onClick={novoUsuario}>
          Cadastrar
        </button>
        <button className="button-login" onClick={logarUser}>
          Logar
        </button>
      </div>
      ;
      <br />
      <br /> <hr />
      <div className="container">
        <label>Id do post:</label>
        <input
          placeholder="Digite o ID do post"
          value={idPost}
          onChange={(e) => setIdPost(e.target.value)}
        />

        <label>Titulo:</label>
        <input
          type="text"
          placeholder="Digite o titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        ></input>

        <label>Autor:</label>

        <input
          type="text"
          placeholder="Autor do post"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />

        <div className="button">
          <button onClick={handleAdd}>Cadastrar</button>
          <button onClick={buscarPost}>Buscar Post</button>

          <button onClick={edit}>Atualizar post</button>
        </div>
        <ul>
          <h2>Posts</h2>
          {posts.map((post) => {
            return (
              <li key={post.id} className="posts-card">
                <div className="itens">
                  <strong>ID: {post.id}</strong>

                  <span>Titulo: {post.titulo}</span>

                  <span>Autor: {post.autor}</span>
                </div>

                <div className="button-lateral">
                  <button onClick={() => excluir(post.id)}>Excluir</button>
                </div>
                <div className="clear"></div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
