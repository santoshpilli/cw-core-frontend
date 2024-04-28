import React, { useState, useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { useHistory } from "react-router-dom";
import { Menu, Layout, Card, Select, message, Row, Col, Tooltip, Button } from "antd";
import { LeftOutlined,RightOutlined,MinusCircleOutlined } from '@ant-design/icons';
import ThemeJson from "../../constants/UIServer.json"
import { useGlobalContext } from "../../lib/storage";
import iconSide from "../../assets/images/hoverLine.svg"
import backLeft from "../../assets/images/menuHide.svg"
import "../../styles/app.css";
import "../../styles/antd.css";
import "./menu.css";

const { Sider } = Layout;

const SideMenu = (props) => {
  // const textInput = React.useRef(null);
  const selectedApp = localStorage.getItem("appName");
  const { globalStore, setGlobalStore } = useGlobalContext();
  const Themes = ThemeJson;
  const { sideMenuData: menuList, windowTabs, userPreferences } = globalStore;
  const [view,setView] = useState(false)
  const {  fullMenuToggle, setFullMenuToggle ,setMenuToggle , menuToggle ,setShowToggler,setIframeUrl} = props;
  const [menuData, setMenuData] = useState([]);
  const history = useHistory();
  let lowerSubMenu = JSON.parse(localStorage.getItem("lowerSubMenu"));
 

  useEffect(() => {   
    if (menuList) {
      try {
        menuList.sort((a, b) => (a.seqno != null ? parseInt(a.seqno) : Infinity) - (b.seqno != null ? parseInt(b.seqno) : Infinity));
        menuList.map((item, index) => {
          if (item.children && item.children.length > 0) {
            item.children.sort((a, b) => (a.seqno != null ? parseInt(a.seqno) : Infinity) - (b.seqno != null ? parseInt(b.seqno) : Infinity));
            item.children.map((subItem, subIndex) => {
              if (subItem.children && subItem.children.length > 0) {
                subItem.children.sort((a, b) => (a.seqno != null ? parseInt(a.seqno) : Infinity) - (b.seqno != null ? parseInt(b.seqno) : Infinity));
              }
              // item.children[subIndex] = subItem;
              return null;
            });
          }
          menuList[index] = item;
          return null;
        });
        setMenuData(menuList);
      } catch (error) {
        console.error("Failed to set menu data: ", JSON.stringify(error, null, 2));
      }
    }

  }, [menuList]);
  
  const selectMenuToNavigate = (data) => {
    
    localStorage.setItem("lowerSubMenuItem", data.key);
    if (data.type === "Report") {
      localStorage.setItem("windowType","Report")
      history.push(`/reports/report/${data.id}`);
    } else if (data.type === "Dashboard") {
      localStorage.setItem("windowType","Dashboard")
      history.push(`/analytics/dashboard/${data.id}`);
    } else if (data.type === "Generic") {
      history.push(`/window/list/${data.id}`);
    } else if (data.type === "Custom") {
      history.push(`/others/window/${data.id}`);
    } else if (data.type === "External" ) {
      if(data.navigation === "NewTab"){
        window.open(`${data.url}`)
      }else if (data.navigation === "EmbeddedView"){
        setIframeUrl(data.url)
      }else if (data.navigation === "popopWindow"){
        const popupUrl = data.url; 
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const popupWidth = 600; // Set the width of the popup window
      const popupHeight = 400; // Set the height of the popup window
      const leftPosition = (screenWidth - popupWidth) / 2;
      const topPosition = (screenHeight - popupHeight) / 2;
      // Define other options for the popup window
      const popupOptions = `
        width=${popupWidth},
        height=${popupHeight},
        top=${topPosition},
        left=${leftPosition},
        resizable=yes,
        scrollbars=yes,
        status=no,
        toolbar=no,
        menubar=no,
        location=no `;
      window.open(popupUrl, "popupWindow", popupOptions);
      }
    } else {
      message.warning("Not Available");
    } 
  };
 

  const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      backgroundColor: "#c1c1c1",
      borderRadius: "5px",
      width: "8px",
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  };

  const renderView = ({ style, ...props }) => {
    const viewStyle = {
      color: "#00000",
    };
    return <div className="box" style={{ ...style, ...viewStyle }} {...props} />;
  };

  

  const fullToggle = () => {
    setFullMenuToggle((t) => !t);
    setTimeout(() => {
      setMenuToggle((t) => !t);
      setShowToggler(false);
    }, 0);
  }

  let lowerSubMenuItem = localStorage.getItem("lowerSubMenuItem")
  let sideMenuStyle = ""
  let rightMargin = ""
  if(menuToggle){
    sideMenuStyle = "0px"
    rightMargin="10px"
  }else{
    sideMenuStyle = "0px"
    rightMargin="0.7em"
  }

  return (
    <div className="responsiveSideMenu" style={{marginTop:'0.7em',marginLeft:sideMenuStyle,marginRight:rightMargin,fontFamily:'Inter'}}>
    {lowerSubMenu !== undefined && lowerSubMenu !== null && lowerSubMenu.length !== 0?
        <Sider  collapsed={menuToggle} onCollapse={null} style={{backgroundColor:'#FFFFFF'}} className={menuToggle ? (fullMenuToggle ? "fullmenu-inactive" : "fullmenu-active") : null}>
       
        {/* <Card style={Themes.sideMenu.sideMenuCard}> */}
            <Scrollbars
              style={{
                // marginLeft:'1.5px',
                height:"81vh",
                transition: 'height 0.3s'
              }}
              universal
              autoHide
              autoHideTimeout={1000}
              autoHideDuration={200}
              thumbSize={90}
              renderView={renderView}
              renderThumbHorizontal={renderThumb}
              renderThumbVertical={renderThumb}
            >

              <Menu selectedKeys={lowerSubMenuItem} className="sideMenu" style={{backgroundColor:'#FFFFFF',paddingTop:'1vh',color:"#0C173A",fontSize: "0.8125rem" }} mode="vertical" >
              {lowerSubMenu ? (lowerSubMenu.map((menuList) => {
                  
                  return (
                    <Menu.Item
                    id={
                      history.location.pathname === '/window/list/7008'
                        ? menuList.title === 'Quick Purchase Order'
                          ? 'step1'
                          : ''
                            : history.location.pathname === '/others/window/7359'
                              ? menuList.title === "Quick Wastage Entry"
                                ? 'step11'
                                : ''
                              : history.location.pathname === '/others/window/7360'
                                ? menuList.title === "Quick Goods Receipt"
                                  ? 'step11'
                                  : ''
                                  : history.location.pathname === '/others/window/7296'
                                ? menuList.title === "Quick Stock Receipt"
                                  ? 'step13'
                                  : ''
                                : ''
                    }
                    style={{color:"#0C173A",borderBottom: '1px solid rgba(229, 229, 229, 0.4)',height:"5.5vh",lineHeight:"2.5em",borderBottomStyle:"none"}} key={menuList.title} onClick={()=>selectMenuToNavigate({type:menuList.type,id:menuList.id,key:menuList.title,navigation:menuList.navigation,url:menuList.url,type:menuList.type})}>{menuList.title}</Menu.Item>
                  )

                }))
              :(
                setMenuToggle(true) && setFullMenuToggle(true)
              )
              }
              </Menu>
            </Scrollbars>
            <div className={menuToggle?"toggle":"menu-toggle"}>
            <Tooltip  title={menuToggle?"Show Menu":"Hide Menu"} placement="left">
          <Button style={{border:"none",paddingRight:"1px",background:"transparent",boxShadow:"none"}}  onClick={fullToggle} >
         {menuToggle?(view?<img style={{ transform: view ? 'scaleX(-1)' : 'scaleX(1)' }} onMouseLeave={()=>setView(false)} src={backLeft}/>:<img  onMouseEnter={()=>setView(true)} src={iconSide}/>):view?<img  onMouseLeave={()=>setView(false)} src={backLeft}/>:<img  onMouseEnter={()=>setView(true)} src={iconSide}/>} 
          </Button>
          </Tooltip>
        </div>
            {/* </Card> */}
       </Sider>:""}
       
    </div>
  );
};

export default SideMenu;