import React,{useEffect, useState} from 'react'
import { Modal,Menu ,message, Drawer, Collapse,List,Card,Dropdown} from 'antd'
import { Scrollbars } from "react-custom-scrollbars";
import {  CloseOutlined } from "@ant-design/icons"
import { useHistory } from "react-router-dom";
import NewLogo from "../../assets/images/NewLogoCW.svg";
import Icon from "@ant-design/icons";
import { ReactComponent as CloseX } from "./closeX.svg";
import "./style.css";
import { useGlobalContext } from "../../lib/storage";
// import mobileMenuLogo from "../../assets/images/mobMenuLogo.svg";
import mobileMenuLogo from "../../assets/images/mobLogo1.svg";
import appIcon from "../../assets/images/appIconMobile.svg";
import { getOAuthHeaders } from '../../constants/oAuthValidation';

export default function MobileMenu(props) {
  const { globalStore, setGlobalStore } = useGlobalContext();
  const { sideMenuData: menuList, windowTabs, userPreferences } = globalStore;
    const history = useHistory();
    const { SubMenu } = Menu;
const authHeaders = getOAuthHeaders();
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
    // let subMenuItem = JSON.parse(localStorage.getItem("subMenuItem"))
    let subMenuData = JSON.parse(localStorage.getItem("subMenuData"))
    const [subMenu,setSubMenu] = useState(JSON.parse(localStorage.getItem("subMenuData")))
    const {mobMenu,setMobMenu,setSelectedMainMenuItem,menuData} = props;
    const [openKeys, setOpenKeys] = useState(subMenu.map((menu) => menu.key));
    const [open, setOpen] = useState(false);
    let selectecMianMenuItem = localStorage.getItem("appId");
    const handleOpenChange = (keys) => {
      setOpenKeys(keys);
    };
  // useEffect(()=>{

  //   },[subMenu])
  const NavigateToMenu = (menuType, menuId, menuTitle,menuKey) => {
    // setMenuIdFromUrl(menuId)
    if(menuKey){
    localStorage.setItem("lowerSubMenuItem",JSON.stringify(menuKey))}
    let navigationUrl;
    switch (menuType) {
      case "Report":
        navigationUrl = `/reports/report/${menuId}`;
        break;
      case "Dashboard":
        navigationUrl = `/analytics/dashboard/${menuId}`;
        break;
      case "Generic":
        navigationUrl = `/window/list/${menuId}`;
        break;
      case "Custom":
        navigationUrl = `/others/window/${menuId}`;
        break;
      case "GenericNew":
        navigationUrl = `/window/${menuId}/NEW_RECORD`;
        break;
      default:
        message.warning("Not Available");
        break;
    }
    if (navigationUrl) {
      if (userPreferences.enableMultiTab === "Y") {
        const prevWindowTabs = [...windowTabs];
        if (prevWindowTabs.findIndex((tab) => tab.url === navigationUrl) < 0) {
          const newWindowTab = {
            url: navigationUrl,
            title: menuTitle,
            content: null,
          };
          setGlobalStore({ windowTabs: [...prevWindowTabs, newWindowTab] });
          history.push(navigationUrl);
        } else {
          message.warning("Tab Already Active");
        }
      } else {
        history.push(navigationUrl);
      }
    }
    localStorage.setItem("subMenuItem",JSON.stringify(menuKey))
    setMobMenu(false)
    // props.onClose();
  };

const handleSession = (item) => async () => {
  let menuData = JSON.parse(localStorage.getItem("sideMenuData"))
  menuData.map((menu, index) => {
    if (menu.app_id === item.app_id) {
      localStorage.setItem("selectecMianMenuItem", JSON.stringify(item.app_id))
      localStorage.setItem("subMenuData", JSON.stringify(menu.children))
      // setSelectedMainMenuItem(menu.children)
    }
  })
  // setGlobalStore({ loading: true });
  // const { email, tenantId } = getOAuthHeaders();
  // const body = {
  //   tenantId: tenantId,
  //   appId: item.app_id,
  //   username: email
  // };
  // let email = localStorage.getItem("email");
  // let tenantId = localStorage.getItem("tenantId");
  // let token = JSON.parse(localStorage.getItem("authTokens"));
  // let refreshToken = JSON.parse(localStorage.getItem("refreshToken"));
  // const body = {
  //   username: email,
  //   tenantId: tenantId,
  //   appId: item.app_id,
  //   authToken: token
  // };
  // const response = await axios({
  //   url: `${tamURL}access/upsertUserTenantSession`,
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   data: body
  // });

  // if (response.status === 200) {
    // const reqBody = {
    //     username: email,
    //     authToken: token,
    //     refreshToken: refreshToken,
    //     tillId : null
    // };
    // const resp = await axios({
    //   url: `${tamURL}access/upsertUserToken`,
    //   method: "POST",
    //   headers: {
    //       "Content-Type": "application/json",
    //   },
    //   data: reqBody
    // });

    // if (resp.status === 200) {
    setGlobalStore({ loading: true });
    // localStorage.removeItem("authTokensFlag");
    // localStorage.removeItem("authTokens");
    localStorage.removeItem("lowerSubMenu");
    // localStorage.removeItem("selectecMianMenuItem");
    localStorage.removeItem("subMenuItem");
    // localStorage.removeItem("subMenuData");
    // localStorage.removeItem("appId");
    localStorage.setItem("appName", item.app);
    localStorage.setItem("appId", item.app_id);
    let menuDataResponse = JSON.parse(localStorage.getItem(item.app_id));
    if (menuDataResponse?.length > 0) {
      menuDataResponse[0]?.children.sort((a, b) => {
        const x = a.seqno !== null ? parseInt(a.seqno) : a.seqno;
        const y = b.seqno !== null ? parseInt(b.seqno) : b.seqno;
        return (x != null ? x : Infinity) - (y != null ? y : Infinity);
      });
      localStorage.setItem("subMenuData", JSON.stringify(menuDataResponse[0]?.children));
    } else {
      localStorage.setItem("subMenuData", JSON.stringify([]));
    };
    
    const refState = props.location?.state;

    if (refState !== undefined && refState.referer.pathname !== "/:appName") {
      history.push(props.location.state.referer.pathname);
    } else {
      if (item.appURL.includes("app-x-test")) {
        window.location.assign(`${item.appURL}`);
      } else {
        history.push(`${item.appURL}`.replace("https://plg1.cwsuite.com",""));
      };
    };
    setGlobalStore({ loading: false });
    // history.push(`/?appId=${encodeURIComponent(item.app_id)}&name=${encodeURIComponent(item.app)}`);
    // let url = `${item.appURL}?appId=${encodeURIComponent(item.app_id)}&name=${encodeURIComponent(item.app)}`;
    // let url = `http://localhost:3002/?appId=${encodeURIComponent(item.app_id)}&name=${encodeURIComponent(item.app)}`;
    // window.location.assign(url);
    // };
  // };
};

const content =(
  <Card style={{width:"60%",padding:"1em"}}>
    <Menu selectedKeys={selectecMianMenuItem} itemLayout="vertical" onClick={(t)=>{setOpen(!t)}}  style={{backgroundColor:"",fontFamily:"Inter",width:"fit-content",cursor:"pointer"}}>
    {menuData?.map(menu=>{
                return(
                <Menu.Item onClick={handleSession(menu)} key={menu.app_id}>{menu.app}</Menu.Item>
                )
              })}

    </Menu>
  </Card>
)

    const subMenuNavigate = (data) => {
        if (data.children === undefined || data.children === null) {
          localStorage.setItem("subMenuItem", JSON.stringify(data.key))
          localStorage.setItem("lowerSubMenu", null)
          // setMenuToggle(true)
          // setFullMenuToggle(true)
          if (data.type === "Report") {
            history.push(`/reports/report/${data.id}`);
          } else if (data.type === "Dashboard") {
            history.push(`/analytics/dashboard/${data.id}`);
          } else if (data.type === "Generic") {
            history.push(`/window/list/${data.id}`);
          } else if (data.type === "Custom") {
            history.push(`/others/window/${data.id}`);
          }
        }
        else {
          localStorage.setItem("lowerSubMenu", JSON.stringify(data.children))
          localStorage.setItem("lowerSubMenuItem", JSON.stringify(data.children[0].key))
          localStorage.setItem("subMenuItem", JSON.stringify(data.key))
          if (data.children[0].type === "Report") {
            history.push(`/reports/report/${data.children[0].id}`);
          } else if (data.children[0].type === "Dashboard") {
            history.push(`/analytics/dashboard/${data.children[0].id}`);
          } else if (data.children[0].type === "Generic") {
            history.push(`/window/list/${data.children[0].id}`);
          } else if (data.children[0].type === "Custom") {
            history.push(`/others/window/${data.children[0].id}`);
          }
        }
      };
    
      const selectMenuToNavigate = (data) => {
        localStorage.setItem("selectedSubMenuTitle",subMenuData[data.index].title)
        localStorage.setItem("lowerSubMenuItem", JSON.stringify(data.key));
        localStorage.setItem("subMenuItem", JSON.stringify(data.title))
        if (data.type === "Report") {
          localStorage.setItem("windowType", "Report")
          history.push(`/reports/report/${data.id}`);
        } else if (data.type === "Dashboard") {
          localStorage.setItem("windowType", "Dashboard")
          history.push(`/analytics/dashboard/${data.id}`);
        } else if (data.type === "Generic") {
          history.push(`/window/list/${data.id}`);
        } else if (data.type === "Custom") {
          history.push(`/others/window/${data.id}`);
        } else {
          message.warning("Not Available");
        }
      };
      // let topMenu = JSON.parse(localStorage.getItem("sideMenuData"))
      let mainMenuItem = localStorage.getItem("appName")
     
      // let lowerSubMenuItem =JSON.parse(localStorage.getItem("lowerSubMenuItem"))
  return (
    
       <Drawer
       placement="left"
       width="100%"
        visible={mobMenu}
        title={<>
        <div  style={{backgroundColor:"#fff",height:"3em",padding:"0px"}}>
          <img style={{padding:"10px 0px 0px 8px",height:"2.4em"}} src={NewLogo} alt=''/>
          {/* <span style={{fontFamily:"Inter",fontWeight:700,fontSize:"14px",float:"left"}}>{mainMenuItem}</span> */}
          <span style={{ float: 'right',padding:"12px 12px 0px 0px" }}>
            {/* <CloseOutlined style={{color:"white",fontWeight:600}} onClick={() => setMobMenu(false)} /> */}
            <Icon
          onClick={() => setMobMenu(false)}
          component={CloseX}
           />
            </span>
          </div>
        </>}
        style={{ float: 'left', top: 0 }}
        // bodyStyle={{width:"70%"}}
        footer={null}
        closable={false}>
        <Scrollbars
          style={{
            height: "85vh",
          }}
          autoHide
          autoHideTimeout={1000}
          autoHideDuration={200}
          thumbSize={90}
          renderView={renderView}
          renderThumbHorizontal={renderThumb}
          renderThumbVertical={renderThumb}
        >
          {authHeaders.Enterprise?
          <Menu theme="light" mode="inline" /* openKeys={openKeys} onOpenChange={onOpenChange} */>
              {menuData?.map((menu, menuIndex) =>
                // menu.children && menu.children.length > 0 ? (
                  <SubMenu
                  style={{padding:"0.5em 0em",borderBottom:"1px solid #c2c2c2"}}
                    key={`${menu.key}`}
                    title={
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>{menu.title}</span>
                        <span
                          className="fa fa-chevron-down"
                          style={{
                            color: "#666666",
                            width: "23px",
                            paddingTop:"1em",
                            display: "flex",
                          }}
                        >
                          &ensp;
                        </span>
                      </div>
                    }
                  >
                    {menu.children.map((subMenuItem, index) =>
                      subMenuItem.children && subMenuItem.children.length > 0 ? (
                        <SubMenu
                          key={`${subMenuItem.key}`}
                          icon={
                            <span /*className={subMenuItem.icon}*/ style={{ color: "#666666", width: "23px" }}>
                              &ensp;
                            </span>
                          }
                          style={{marginLeft:"2.7em",marginTop:"0.5em",marginBottom:"0.5em"}}
                          title={
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span>{subMenuItem.title}</span>
                              <span
                                className="fa fa-chevron-down"
                                style={{
                                  color: "#666666",
                                  width: "23px",
                                  paddingTop:"0.5em",
                                  display: "flex",
                                }}
                              >
                                &ensp;
                              </span>
                            </div>
                          }
                          // title={`${subMenuItem.title}`}
                        >
                          {subMenuItem.children.map((lowerSubMenuItem, index) => (
                            <Menu.Item
                              key={`${lowerSubMenuItem.key}-${index}`}
                              style={{width:'auto',paddingRight:'10px',marginLeft:"-7.5em",marginBottom:"0.5em",marginTop:"0.5em"}}
                            >
                              <span title={lowerSubMenuItem.title} onClick={() => NavigateToMenu(lowerSubMenuItem.type, lowerSubMenuItem.id, lowerSubMenuItem.title,lowerSubMenuItem.key)}>
                                {lowerSubMenuItem.title}
                              </span>
                            </Menu.Item>
                          ))}
                        </SubMenu>
                      ) : (
                        <SubMenu
                          key={`${subMenuItem.key}`}
                          icon={
                            <span /*className={subMenuItem.icon}*/ style={{ color: "#666666", width: "23px" }}>
                              &ensp;
                            </span>
                          }
                          onTitleClick={() => NavigateToMenu(subMenuItem.type, subMenuItem.id,subMenuItem.title,subMenuItem.key)}
                          style={{marginLeft:"2.7em",marginTop:"0.7em"}}
                          title={`${subMenuItem.title}`}
                          // style={{width:'auto'}}
                          // style={{width:'auto',overflow:'visible',textOverflow:'clip',whiteSpace:'normal',lineHeight:'15px'}}
                        >
                          {/* <span title={subMenuItem.title} onClick={() => NavigateToMenu(subMenuItem.type, subMenuItem.id, subMenuItem.title)}>
                            {subMenuItem.title} 
                          </span> */}
                        </SubMenu>
                      )
                    )}
                  </SubMenu>
                // ) : (
                //   <Menu.Item
                //     key={`${menu.key}`}
                //     icon={
                //       <span className={menu.icon} style={{ color: "#666666", width: "23px" }}>
                //         &ensp;
                //       </span>
                //     }
                //     style={{width:'auto',paddingRight:'10px'}}
                //   >
                //     <span  title={menu.title} onClick={() => NavigateToMenu(menu.type, menu.id, menu.title)}>
                //       {menu.title}
                //     </span>
                //     &emsp;
                //     <span title={`Add New ${menu.title}`} onClick={() => NavigateToMenu(`${menu.type}New`, menu.id, menu.title)}>
                //       +
                //     </span>
                //   </Menu.Item>
                // )
              )}
          </Menu>:<Menu theme="light" mode="inline" /* openKeys={openKeys} onOpenChange={onOpenChange} */>
              {menuData?.map((menu, menuIndex) =>
                menu.children && menu.children.length > 0 ? (
                  <SubMenu
                  style={{padding:"0.5em 0em"}}
                    key={`${menu.key}`}
                    title={
                      <div style={{ display: "flex", justifyContent: "space-between" ,borderBottom:"1px solid #c2c2c2"}}>
                        <span>{menu.title}</span>
                        <span
                          className="fa fa-chevron-down"
                          style={{
                            color: "#666666",
                            width: "23px",
                            paddingTop:"1em",
                            display: "flex",
                          }}
                        >
                          &ensp;
                        </span>
                      </div>
                    }
                  >
                    {menu.children.map((subMenuItem, index) =>
                      subMenuItem.children && subMenuItem.children.length > 0 ? (
                        <SubMenu
                          key={`${subMenuItem.key}`}
                          icon={
                            <span /*className={subMenuItem.icon}*/ style={{ color: "#666666", width: "23px" }}>
                              &ensp;
                            </span>
                          }
                          style={{marginLeft:"3em"}}
                          title={`${subMenuItem.title}`}
                        >
                          {subMenuItem.children.map((lowerSubMenuItem, index) => (
                            <Menu.Item
                              key={`${lowerSubMenuItem.key}-${index}`}
                              style={{width:'auto',paddingRight:'10px',marginLeft:"-7.1em"}}
                            >
                              <span title={lowerSubMenuItem.title} onClick={() => NavigateToMenu(lowerSubMenuItem.type, lowerSubMenuItem.id, lowerSubMenuItem.title,lowerSubMenuItem.key)}>
                                {lowerSubMenuItem.title}
                              </span>
                            </Menu.Item>
                          ))}
                        </SubMenu>
                      ) : (
                        <Menu.Item
                          key={`${subMenuItem.key}-${index}`}
                          icon={
                            <span className={subMenuItem.icon} style={{ color: "#666666", width: "23px" }}>
                              &ensp;
                            </span>
                          }
                          style={{width:'auto',paddingRight:'10px'}}
                          // style={{width:'auto',overflow:'visible',textOverflow:'clip',whiteSpace:'normal',lineHeight:'15px'}}
                        >
                          <span title={subMenuItem.title} onClick={() => NavigateToMenu(subMenuItem.type, subMenuItem.id, subMenuItem.title)}>
                            {subMenuItem.title}
                          </span>
                        </Menu.Item>
                      )
                    )}
                  </SubMenu>
                ) : null
                // (
                //   <Menu.Item
                //     key={`${menu.key}`}
                //     icon={
                //       <span className={menu.icon} style={{ color: "#666666", width: "23px" }}>
                //         &ensp;
                //       </span>
                //     }
                //     style={{width:'auto',paddingRight:'10px'}}
                //   >
                //     <span  title={menu.title} onClick={() => NavigateToMenu(menu.type, menu.id, menu.title)}>
                //       {menu.title}
                //     </span>
                //     &emsp;
                //     <span title={`Add New ${menu.title}`} onClick={() => NavigateToMenu(`${menu.type}New`, menu.id, menu.title)}>
                //       +
                //     </span>
                //   </Menu.Item>
                // )
              )}
          </Menu>}
        </Scrollbars>
      </Drawer> 
    
  )
}
