import { useState, useEffect } from "react";
import { db } from "./firebaseConnection";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import Header from "./components/header";

import "./app.css";
import { async } from "@firebase/util";

function App() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [idPost, setIdPost] = useState("");

  const [posts, setPosts] = useState([]);

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

  return (
    <div className="App">
      <Header />
      <div className="container">
        <label>Id do post</label>
        <input
          placeholder="Digite o ID do post"
          value={idPost}
          onChange={(e) => setIdPost(e.target.value)}
        />
        <br />

        <label>Titulo</label>
        <textarea
          type="text"
          placeholder="Digite o titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        ></textarea>

        <label>Autor:</label>

        <input
          type="text"
          placeholder="Autor do post"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />

        <button onClick={handleAdd}>Cadastrar</button>
        <button onClick={buscarPost}>Buscar Post</button>
        <br />

        <button onClick={edit}>Atualizar post</button>

        <br />

        <ul>
          {posts.map((post) => {
            return (
              <li key={post.id}>
                <strong>ID: {post.id}</strong>
                <br />
                <span>Titulo: {post.titulo}</span>
                <br />
                <span>Autor: {post.autor}</span>
                <br />
                <button onClick={() => excluir(post.id)}>Excluir</button>
                <br />
                <br />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
