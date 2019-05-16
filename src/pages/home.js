import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

import PostForm from '../components/PostForm';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [limit, setLimit] = useState(5);
  const [editingPost, setEditingPost] = useState({
    title: '',
    body: '',
    id: null
  });

  useEffect(() => {
    axios
      .get('/posts')
      .then((res) => {
        console.log(res.data);
        setPosts(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  function editPost(post) {
    setEditingPost(post);
  }

  function deletePost(id) {
    axios.delete(`/post/${id}`).then(() => {
      const postsUpdated = posts.filter((p) => p.id !== id);
      setPosts(postsUpdated);
    });
  }

  function addPost(post) {
    if (posts.find((p) => p.id === post.id)) {
      const index = posts.findIndex((p) => p.id === post.id);
      const postsUpdated = [...posts];
      postsUpdated.splice(index, 1, post);
      setPosts(postsUpdated);
    } else {
      const postsUpdated = [post, ...posts];
      setPosts(postsUpdated);
    }
  }

  const getNumberOfPosts = () => {
    axios
      .get(`/posts/${limit}`)
      .then((res) => setPosts(res.data))
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <div className="row">
        <div className="col s6">
          <PostForm addPost={addPost} editingPost={editingPost} />
        </div>
        <div className="col s3 push-in">
          <p>Limit number of posts</p>
          <input
            type="number"
            value={limit}
            onChange={(event) => setLimit(event.target.value)}
          />
          <button
            onClick={getNumberOfPosts}
            className="waves-effect waves-light btn"
          >
            Set
          </button>
        </div>
      </div>
      <div className="row">
        {posts.map((post) => (
          <div className="col s6" key={post.id}>
            <div className="card">
              <div className="card-content">
                <div className="card-title">{post.title}</div>
                <p className="timestamp">
                  {dayjs(post.createdAt).format('MMM DD YYYY HH:mm')}
                </p>
                <p>{post.body}</p>
              </div>
              <div className="card-action">
                <a href="#" onClick={editPost.bind(null, post)}>
                  Edit
                </a>
                <a
                  href="#"
                  onClick={deletePost.bind(null, post.id)}
                  className="delete-btn"
                >
                  Delete
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
