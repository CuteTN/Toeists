import React, { useState, useEffect } from "react";
import styles from "./styles.js";
import { Layout, Card } from "antd";

import Navbar from "../../components/Navbar/Navbar";
import FullPost from "../../components/FullPost/FullPost.js";
import CommentForm from "../../components/CommentForm/CommentForm.js";
import { fetchAPost } from "../../services/api/forum.js";
import { useHistory } from "react-router-dom";
import NumberOfComment from "./NumberOfComment/NumberOfComment.js";

export function shuffle(array) {
  var currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function SpecificForumPage(props) {
  const history = useHistory();

  const { id, focusedCommentId } = props.match.params;
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    fetchAPost(id)
      .then((res) => {
        setPost(res.data);
      })
      .catch((err) => {
        switch (err.response?.status) {
          case 404:
            history.push("/error404");
            break;
          case 403:
            history.push("/error403");
            break;
          default:
            history.push("/error404");
        }
      });
  };

  return (
    <>
      <Layout>
        <Navbar />
        <div style={styles.mainArea} className="row">
          <div className="col-md-8 mb-4">
            <div>
              <Card style={{ padding: 16 }}>
                {/* {post ? <FullPost post={post} /> : <Loading />} */}
                <FullPost post={post} />
                {/* put there for anchor link to comments */}
                {/* <div id="comments"></div> */}

                <div id="comments"></div>
                <CommentForm
                  // onSubmit={handleSubmitComment}
                  label="Comment to this post"
                />
                <NumberOfComment comments={post?.comments} />
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default SpecificForumPage;
