import React from "react";
import { Layout } from "antd";
import styles from "./styles.js";
import FeedMenu from "./FeedMenu/FeedMenu.js";
import { useAuth } from "../../../contexts/authenticationContext.js";

const { Sider } = Layout;

function FeedSidebar() {
  const { signedInUser } = useAuth();

  return (
    <div>
      <Sider
        breakpoint="lg"
        // width={200}
        collapsedWidth="0"
        // trigger={null}
        style={{
          ...styles.paleBackground,
          ...styles.fixedSider,
        }}
      >
        <FeedMenu user={signedInUser} />
      </Sider>
    </div>
  );
}

export default FeedSidebar;
