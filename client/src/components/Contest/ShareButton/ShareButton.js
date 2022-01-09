import React from "react";
import { Modal, Tooltip } from "antd";
import { ShareAltOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import {
  FacebookShareCount,
  RedditShareCount,
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  RedditShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  TelegramIcon,
  WhatsappIcon,
  RedditIcon,
  EmailIcon,
} from "react-share";

function ShareButton({ contest }) {
  const history = useHistory();

  const shareUrl = `http://localhost:3000/contests/${contest?._id}`;

  function openShare(contest) {
    Modal.info({
      title: "Share contest",
      content: (
        <div className="row justify-content-around align-items-center">
          <div onClick={() => console.log(window.location)}>
            <FacebookShareButton
              url={shareUrl}
              quote={contest?.title}
              hashtag="YouIT"
            >
              <FacebookIcon size={32} round />
            </FacebookShareButton>

            <div>
              <FacebookShareCount url={shareUrl}>
                {(count) => count}
              </FacebookShareCount>
            </div>
          </div>

          <div>
            <TwitterShareButton url={shareUrl} title={contest?.title}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
          </div>

          <div>
            <TelegramShareButton url={shareUrl} title={contest?.title}>
              <TelegramIcon size={32} round />
            </TelegramShareButton>
          </div>

          <div>
            <WhatsappShareButton
              url={shareUrl}
              title={contest?.title}
              separator=":: "
            >
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
          </div>

          <div>
            <LinkedinShareButton url={shareUrl} title={contest?.title}>
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>
          </div>

          <div>
            <RedditShareButton
              url={shareUrl}
              title={contest?.title}
              windowWidth={660}
              windowHeight={460}
            >
              <RedditIcon size={32} round />
            </RedditShareButton>

            <div>
              <RedditShareCount url={shareUrl} />
            </div>
          </div>

          <div>
            <EmailShareButton
              url={shareUrl}
              subject={contest?.title}
              body="I want to share this contest from YouIt"
            >
              <EmailIcon size={32} round />
            </EmailShareButton>
          </div>

          {/* <Tooltip title="Share YouIT">
            <img
              src={logo}
              alt="Share YouIt"
              className="clickable icon"
              style={{ width: 32, height: 32 }}
              onClick={() => handleSharecontestInternal(contest._id)}
            />
          </Tooltip> */}
        </div>
      ),
      onOk() {},
    });
  }

  const handleSharecontestInternal = (id) => {
    Modal.destroyAll();
    history.push({
      pathname: `contest/create`,
      state: { pinnedUrl: `http://localhost:3000/contests/${id}` },
    });
  };

  return (
    <div>
      <Tooltip title="Share">
        <ShareAltOutlined
          className="clickable icon"
          onClick={() => openShare(contest)}
        />
      </Tooltip>
    </div>
  );
}

export default ShareButton;
