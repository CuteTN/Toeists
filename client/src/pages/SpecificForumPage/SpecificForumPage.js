import React, { useState, useEffect } from "react";
import { Layout, Card } from "antd";
import { useHistory } from "react-router-dom";
import { EditorState } from "draft-js";
//components
import Navbar from "../../components/Navbar/Navbar";
import FullPost from "../../components/FullPost/FullPost.js";
import CommentForm from "../../components/CommentForm/CommentForm.js";
import NumberOfComment from "./NumberOfComment/NumberOfComment.js";
import ListComments from "./ListComments/ListComments.js";
//api
import { fetchAPost } from "../../services/api/forum.js";
import { createComment } from "../../services/api/comment";
//other
import styles from "./styles.js";
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

const SpecificForumPage = (props) => {
  const history = useHistory();

  const { id, focusedCommentId } = props.match.params;
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
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

  const fetchComments = async () => {
    // const { data } = await commentsApi.fetchComments(id);
    // const sortedData = sort?.function(data);
    // if (focusedCommentId) {
    //   const i = sortedData.findIndex((c) => c._id === focusedCommentId);
    //   console.log(i);
    //   if (i > -1) {
    //     const temp = sortedData[0];
    //     sortedData[0] = sortedData[i];
    //     sortedData[i] = temp;
    //   } else {
    //     history.push(`/post/${id}`);
    //   }
    //   setFocusedCommentIndex(i);
    // }
    // setComments(sortedData);
  };

  const handleSubmitComment = async (newComment) => {
    const result = {
      content: newComment,
      forumId: post,
    };
    await createComment(result);
    fetchPost();
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
                  onSubmit={handleSubmitComment}
                  editorState={editorState}
                  label="Comment to this post"
                />
                <NumberOfComment comments={post?.comments} />
                <ListComments post={post} fetchPost={fetchPost} />
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default SpecificForumPage;
