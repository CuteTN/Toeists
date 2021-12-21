import COLOR from "../../constants/colors";

const styles = {
  logo: {
    float: "left",
    height: 64,
    width: 110,
    display: "flex",
    justifyContent: "center",
    marginRight: 24,
  },
  title: {
    fontSize: "2rem",
    fontWeight: 500,
    color: COLOR.white,
  },
  right: {
    float: "right",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fixedHeader: {
    position: "fixed",
    zIndex: 1,
    width: "100%",
  },
  orangeBackground: {
    background: COLOR.orange,
  },
  squareInitials: {
    alignSelf: "center",
    backgroundColor: COLOR.black,
    display: "flex",
    flexDirection: "column",
    fontSize: "large",
    fontWeight: "bold",
    height: 40,
    justifyContent: "center",
    minHeight: 40,
    minWidth: 40,
    width: 40,
    textAlign: "center",
  },
};

export default styles;
