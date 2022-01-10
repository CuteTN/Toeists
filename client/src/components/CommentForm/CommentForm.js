/* eslint-disable react/react-in-jsx-scope */
import { Form, Button, Row, Typography } from "antd";
import { useState } from "react";
import { useAuth } from "../../contexts/authenticationContext";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import RequireLogin from "../../pages/RequireLogin/RequireLogin";

const { Text } = Typography;

function CommentForm({ onSubmit, label, onDiscard, editor }) {
  const [form] = Form.useForm();
  const { signedInUser } = useAuth();
  const [editorState, setEditorState] = useState(editor);

  const onReset = () => {
    form.resetFields();
    setEditorState(EditorState.createEmpty());
  };

  const handleFinish = () => {
    let currentContentAsHTML = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    onSubmit(currentContentAsHTML);
    onReset();
  };

  const handleEditorChange = (state) => {
    setEditorState(state);
  };

  return (
    <div>
      {signedInUser ? (
        // eslint-disable-next-line react/react-in-jsx-scope
        <Form
          layout="vertical"
          form={form}
          name="control-hooks"
          onFinish={handleFinish}
          requiredMark={false}
        >
          <Form.Item name="userComment" label={label}>
            <Editor
              placeholder="Enter some text..."
              editorState={editorState}
              // toolbarClassName="toolbarClassName"
              // wrapperClassName="wrapperClassName"
              // editorClassName="editorClassName"
              onEditorStateChange={handleEditorChange}
              toolbar={{
                inline: { inDropdown: true },
                list: { inDropdown: true },
                textAlign: { inDropdown: false },
                link: { inDropdown: false },
                history: { inDropdown: false },
                image: {
                  alt: { present: true, mandatory: true },
                },
              }}
              editorStyle={{ maxHeight: "100px", minHeight: "100px" }}
            />
          </Form.Item>
          <Form.Item>
            <Row justify="end" align="middle">
              {onDiscard ? (
                <Text strong className="clickable mr-4" onClick={onDiscard}>
                  Discard
                </Text>
              ) : null}
              <Button
                htmlType="button"
                className="white-button mr-3"
                size="large"
                onClick={onReset}
                disabled={!editorState}
              >
                Reset
              </Button>
              <Button
                className="orange-button"
                size="large"
                htmlType="submit"
                disabled={!editorState}
              >
                Submit
              </Button>
            </Row>
          </Form.Item>
        </Form>
      ) : (
        <RequireLogin restrictedAction="write a comment" />
      )}
    </div>
  );
}

export default CommentForm;
