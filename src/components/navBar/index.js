import React, { useState, useEffect } from "react";
import { useHistory,useParams } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars";
import { Row, Col, Popover, Image, Button, Divider, Form, Select, Card, message, Menu, Tooltip, Input, Dropdown } from "antd";
import { useGlobalContext } from "../../lib/storage";
// import Search from "../../assets/images/searchIcon.svg"
import {
  getAdminMenuList,
  get360MenuList,
  getFavouritesMenuList,
  removeFavouriteMenu,
  createFavouriteMenu,
  getLoggedInUserRoles,
  getLoggedInBusinessUnits,
  updateRoles,
  getUser,
  getUserPreferencesData,
} from "../../services/generic";
import {
  MailOutlined, StarOutlined, SettingOutlined, CloseOutlined
} from '@ant-design/icons'
import NewLogo from "../../assets/images/NewLogoCW.svg";
import UserIconMobile from "../../assets/images/profileMobile.svg";
import NewLogo1 from "../../assets/images/mobLogo1.svg";
import mobileGlobalSearch from "../../assets/images/mobileGlobalSearch.svg";
import ToggleIcon from "../../assets/images/toggleIcon.svg";
import { getOAuthHeaders } from "../../constants/oAuthValidation";
import MobileLogo from "../../assets/images/mobileLogo.svg";
import MenuIconNav from "../../assets/images/MenuIconNav.svg";
import SearchIcon from "../../assets/images/icon _search.svg"
import Profile from "../../assets/images/blankImage.png";
// import ProfileIcon from "../../assets/images/profileIcon.svg";
import PrductTour from "../../assets/images/productour.svg"
import LeaveFeedback from "../../assets/images/leaveFeedback.svg"
import Settings from "../../assets/images/settingIcon1.svg"
import Bell from "../../assets/images/bellIcon.svg"
import Help from "../../assets/images/helpCenter.svg"
import LogoutIcon from "../../assets/images/logoutIcon.svg";
import Yellowpin from "../../assets/images/Yellowpin.svg";
import MoreNavs from "../../assets/images/NewMoreNavsIcon.svg";
import UserIcon from "../../assets/images/NewUserIcon.svg";
import appIcon from "../../assets/images/navAppIcon.svg";
import ProfileIcon from "../../assets/images/profileIConNEw.svg"
// import HideMenuIconArrow from "../../assets/images/hideMenuIconArrow.svg";
import MenuToggler from "../../assets/images/menuToggler.svg";
// import CollapseToggleIcon from "../../assets/images/collapseToggleIcon.svg"

import mailIcon from "../../assets/images/mailIcon.svg"
import starIcon from "../../assets/images/starIcon.svg"
import settingIcon from "../../assets/images/settingIcon1.svg"
import axios from "axios";
// import { tamURL, logoutUrl, APPSURL } from "../../constants/serverConfig";
import { MenuIcon } from "./Icon";
import MobileMenu from "../mobileMenu";
import "antd/dist/antd.css";
import "../../styles/app.css";
import "../../styles/antd.css";
import "./style.css"
import ThemeJson from "../../constants/UIServer.json"

const { Option, OptGroup } = Select;
const { SubMenu } = Menu;


const NavBar = (props) => {
  const { globalStore, setGlobalStore } = useGlobalContext();
  const history = useHistory();
  const userTheme = globalStore.userData.CW360_V2_UI;
  const clientLogo = process.env.REACT_APP_Client_LOGO_URL;
  const logoFromEnv = process.env.REACT_APP_LOGO_URL;
  const { windowId } = useParams();
  const logoutUrl = process.env.REACT_APP_logoutUrl;
  const APPSURL = process.env.REACT_APP_APPSURL;
  const Themes = ThemeJson;
  let usersData = JSON.parse(localStorage.getItem("userData"));
  const { showToggler, setShowToggler, setDrawerFlag, drawerFlag, setMenuToggle,
    //  menuToggle,
    setFullMenuToggle, fullMenuToggle,setIframeUrl } = props;
  const menuList = globalStore.sideMenuData;
  const [menuData, setMenuData] = useState([]);
  const [favouriteMenuData, setFavouriteMenuData] = useState([]);
  const [selectedMainMenuItem, setSelectedMainMenuItem] = useState([])
  const [dashboardMenuData, setDashboardMenu] = useState([]);
  const [visible, setVisible] = useState(false);
  const [mobMenu, setMobMenu] = useState(false)
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [favouritesVisible, setFavouritesVisible] = useState(false);
  const [showSearch, setShowSearch] = useState(false)
  const [reportsVisible, setReportsVisible] = useState(false);
  const [dashBoardSearchInput, setDashBoardSearchInput] = useState("");
  const [initialDashboardMenuData, setInitialDashboardMenu] = useState([]);
  const [userRoleResposeData, setUserRoleResposeData] = useState([]);
  const [userBusinessUnitData, setUserBusinessUnitData] = useState([]);
  const [bunitId, setBunitId] = useState(null);
  const [roleId, setRoleId] = useState(null);
  const [form] = Form.useForm();
  const authHeaders = getOAuthHeaders();
  const Instance = authHeaders.Enterprise;
  const data = {
    name: globalStore.userData.user,
    Email: globalStore.userData.email,
    Phone: 9876543210,
  };

  useEffect(() => {
    // getCwLogos();
    // getFaviouritesMenus();
    if (menuList) {
      try {
        menuList.sort((a, b) => (a.seqno != null ? parseInt(a.seqno) : Infinity) - (b.seqno != null ? parseInt(b.seqno) : Infinity));
        menuList.map((item, index) => {
          if (item.children && item.children.length > 0) {
            item.children.sort((a, b) => (a.seqno != null ? parseInt(a.seqno) : Infinity) - (b.seqno != null ? parseInt(b.seqno) : Infinity));
          }
          menuList[index] = item;
          return null;
        });
        setMenuData(menuList);
        // 
      } catch (error) {
        console.error("Failed to set menu data: ", JSON.stringify(error, null, 2));
      }
    }
    setBunitId(globalStore.userData.bunit_id);
    setRoleId(globalStore.userData.role_id);
  }, []);

  const logout = () => {
    // setGlobalStore({ authTokens: null, userData: null, sideMenuData: null, userPreferences: null, windowTabs: [] });
    localStorage.clear();
    window.location.assign(`${logoutUrl}`);
  };


  useEffect(()=>{
    const number = history.location.pathname.match(/\d+/);
    if (number && parseInt(number[0]) === 7521 || number && parseInt(number[0]) === 7522 || number && parseInt(number[0]) === 7523 || number && parseInt(number[0]) === 7524) {
      localStorage.setItem("subMenuItem",JSON.stringify("HM"))
    } 
  },[history])

  const goToHome = async () => {
    let menuDataResponse = JSON.parse(localStorage.getItem("sideMenuData"));
    if (menuDataResponse === null) {
      menuDataResponse = await get360MenuList(usersData.role_id);
      localStorage.setItem("sideMenuData", JSON.stringify(menuDataResponse));
    }
    setGlobalStore({ sideMenuData: menuDataResponse });
    history.replace("/");
  };

  useEffect(() => {
    // Get the current pathname
    const currentPath = window.location.pathname;
     // Check if the pathname matches the desired pattern
    if (currentPath.startsWith("/window/list/") || currentPath.match(/^\/window\/\d+\/[a-zA-Z0-9]+$/)) {
        // Extract the ID
        // const pathParts = currentPath.split('/');
        // const windowId = pathParts[pathParts.length - 1];
        // Your logic with windowId
        menuList.forEach(res => {
            res.children.forEach(first => {
                if (first.children) {
                    first.children.forEach(second => {
                        if (second.id === windowId) {
                            console.log(second, "========seco")
                            localStorage.setItem("selectecMianMenuItem", JSON.stringify(res.key))
                            localStorage.setItem("subMenuData", JSON.stringify(res.children))
                            localStorage.setItem("subMenuItem", JSON.stringify(first.key))
                            localStorage.setItem("lowerSubMenu", JSON.stringify(first.children))
                            localStorage.setItem("lowerSubMenuItem", second.title)
                        }
                    })
                } else if (first.id === windowId) {
                    localStorage.setItem("selectecMianMenuItem", JSON.stringify(res.key))
                    localStorage.setItem("subMenuData", JSON.stringify(res.children))
                    localStorage.setItem("subMenuItem", JSON.stringify(first.key))
                    localStorage.setItem("lowerSubMenu", null)
                }
            })
        })
    }
}, [menuList]); // Make sure to include dependencies properly


  const getSubMenu = (subMenuItem) => {
    localStorage.setItem("subMenuItem", JSON.stringify(subMenuItem.key))
  }

  // const navigateToFirstChild = (data) => {
  //   if (data.children === undefined || data.children === null) {
  //     localStorage.removeItem('lowerSubMenu')
  //     localStorage.setItem("subMenuItem", JSON.stringify(data.key))
  //     setMenuToggle(true)
  //     setFullMenuToggle(true)
  //     if (data.type === "Report") {
  //       history.push(`/reports/report/${data.id}`);
  //     } else if (data.type === "Dashboard") {
  //       localStorage.setItem("windowType","Dashboard")
  //       history.push(`/analytics/dashboard/${data.id}`);
  //     } else if (data.type === "Generic") {
  //       history.push(`/window/list/${data.id}`);
  //     } else if (data.type === "Custom") {
  //       history.push(`/others/window/${data.id}`);
  //     }
  //   }
  //   else {
  //     localStorage.setItem("subMenuItem", JSON.stringify(data.key))
  //     localStorage.setItem("lowerSubMenu", JSON.stringify(data.children))
  //     localStorage.setItem("lowerSubMenuItem", JSON.stringify(data.children[0].key))
  //     if (data.children[0].type === "Report") {
  //       localStorage.setItem("windowType","Report")
  //       history.push(`/reports/report/${data.children[0].id}`);
  //     } else if (data.children[0].type === "Dashboard") {
  //       localStorage.setItem("windowType","Dashboard")
  //       history.push(`/analytics/dashboard/${data.children[0].id}`);
  //     } else if (data.children[0].type === "Generic") {
  //       history.push(`/window/list/${data.children[0].id}`);
  //     } else if (data.children[0].type === "Custom") {
  //       history.push(`/others/window/${data.children[0].id}`);
  //     }

  //   }

  // }


  // const getAdminMenus = async () => {
  //   let menuDataResponse = JSON.parse(localStorage.getItem("adminMenuData"));
  //   if (menuDataResponse === null) {
  //     menuDataResponse = await getAdminMenuList(usersData.role_id);
  //     localStorage.setItem("adminMenuData", JSON.stringify(menuDataResponse));
  //   }
  //   history.replace("/");
  //   setGlobalStore({ sideMenuData: menuDataResponse });
  // };

  // const getFaviouritesMenus = async () => {
  //   const favouritesMenuDataResponse = await getFavouritesMenuList();
  //   setFavouriteMenuData(favouritesMenuDataResponse);
  // };

  // const deleteFavourites = async (id) => {
  //   const removeFavouriteMenuResponse = await removeFavouriteMenu(id);
  //   message.success(removeFavouriteMenuResponse);
  //   getFaviouritesMenus();
  // };

  // const selectMenu = async (value, data) => {
  //   // console.log(value,data)
  //   const valueData = value.split("@");
  //   const type = valueData[1];
  //   const addFavouritesResponse = await createFavouriteMenu(data.key1, data.children, data.url, type, globalStore.userData.cs_client_id);
  //   message.success(addFavouritesResponse);
  //   getFaviouritesMenus();
  // };

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

  const getFilteredMenuData = (menuParam, filterKey) => {
    return menuParam.filter((menu) => {
      if (menu.children) {
        const subChildren = menu.children.filter((c) => c.type === filterKey);
        return subChildren.length > 0;
      } else {
        return false;
      }
    });
  };

  const getFilteredSubMenuData = (menuParam, filterKey) => {
    return menuParam.filter((c) => c.type === filterKey);
  };

  const getMainMenu = (menuItem) => {
    menuData.map((menu, index) => {
      if (menu.key === menuItem.key) {
        localStorage.setItem("selectecMianMenuItem", JSON.stringify(menuItem.key))
        localStorage.setItem("subMenuData", JSON.stringify(menu.children))
        setSelectedMainMenuItem(menu.children)
      }
    })
  }

  const getDashboard = () => {
    let dashboardMenu = [];
    let undefinedParent = []
    const menuData1 = []
    for (let index = 0; index < menuData.length; index++) {
      const element = menuData[index].children;
      if (element === undefined || element === null) {
        if (menuData[index].type === "Dashboard") {
          undefinedParent.push(menuData[index])
        }
      } else {
        menuData1.push(menuData[index])
      }
    }
    menuData1.map((menu) => {
      return menu.children.map((data) => {
        if (data.type === "Dashboard") {
          dashboardMenu.push(data);
          return null;
        } else {
          return null;
        }
      });
    });
    const allArray = dashboardMenu.concat(undefinedParent);
    setDashboardMenu(allArray);
    setInitialDashboardMenu(allArray);
  };

  useEffect(() => {
    if (dashBoardSearchInput !== "") {
      const dashBoardSearchResuts = initialDashboardMenuData.filter((m) => m.title.toLowerCase().search(dashBoardSearchInput.toLowerCase()) >= 0);
      setDashboardMenu([...dashBoardSearchResuts]);
    } else {
      getDashboard();
    }
  }, [dashBoardSearchInput, menuData]);

  const handleVisibleChange = (visible) => {
    setVisible(visible);
  };

  const handleFavouritesChange = (visible) => {
    setFavouritesVisible(visible);
  };
  const handleReportsChange = (visible) => {
    setReportsVisible(visible);
  };

  const dashBoardNavigate = (key) => {
    setVisible(false);
    history.push(`/analytics/dashboard/${key}`);
  };

  const onFavourites = (data) => {
    // console.log(data)
    localStorage.setItem("lowerSubMenuItem", JSON.stringify(data.menuId));
    setFavouritesVisible(false);
    if (data.type === "Report") {
      history.push(`/reports/report/${data.menuId}`);
    } else if (data.type === "Dashboard") {
      history.push(`/analytics/dashboard/${data.menuId}`);
    } else if (data.type === "Generic") {
      history.push(`/window/list/${data.menuId}`);
    } else if (data.type === "Custom") {
      history.push(`/others/window/${data.menuId}`);
    } else {
      message.warning("Not Available");
    }
  };

  const onReports = (subMenuItem) => {
    setReportsVisible(false);
    history.push(`/reports/report/${subMenuItem.id}`);
  };

  const getLoggedInUserRolesData = async () => {
    const userRolesRespose = await getLoggedInUserRoles(usersData.user_id);
    setUserRoleResposeData(userRolesRespose);
  };

  const getLoggedInUserBusinessUnitData = async () => {
    const userBusinessUnitResponse = await getLoggedInBusinessUnits(usersData.user_id);
    setUserBusinessUnitData(userBusinessUnitResponse);
  };

  const onSelectRole = (e) => {
    setRoleId(e);
  };

  const onSelectBusinessUnit = (e) => {
    setBunitId(e);
  };

  const changeRoleAndBusinessUnit = async () => {
    const rolesAndBusinessResponse = await updateRoles(roleId, bunitId);
    if (rolesAndBusinessResponse.messageCode === "200") {
      processForUpdate();
    } else {
      message.error(rolesAndBusinessResponse.message);
    }
  };

  const processForUpdate = async () => {
    const userDataResponse = await getUser(globalStore.userData.username);
    userDataResponse.username = globalStore.userData.username;
    if (!userDataResponse) {
      throw new Error("Invalid User Data Response");
    }
    if (userDataResponse.CW360_V2_UI === null || userDataResponse.CW360_V2_UI === undefined) {
      userDataResponse.CW360_V2_UI = ThemeJson;
    } else {
      userDataResponse.CW360_V2_UI = JSON.parse(userDataResponse.CW360_V2_UI);
    }

    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      userDataResponse.CW360_V2_UI = ThemeJson;
    }

    localStorage.setItem("userData", JSON.stringify(userDataResponse));

    const userPreferencesResponse = await getUserPreferencesData();
    localStorage.setItem("userPreferences", JSON.stringify(userPreferencesResponse));

    const menuDataResponse = await get360MenuList(userDataResponse.role_id);
    localStorage.setItem("sideMenuData", JSON.stringify(menuDataResponse));
    setGlobalStore({ userData: userDataResponse, sideMenuData: menuDataResponse, userPreferences: userPreferencesResponse });
    history.push("/");
    window.localStorage.removeItem("windowDefinitions");
    window.location.reload();
  };

  const routeToProfile = () => {
    history.push("/others/window/7465");
  }

  const content = (
    <div style={{ minWidth: "70%"}}>
    <p style={{fontFamily:"Inter",fontWeight:600,fontSize:"1vw",paddingLeft:"1vw",marginBottom:"2px"}}> {data?.name?.split(" ")[0]}</p>
    <p 
    // className="font-normal ff-inter pl-5 pr-8 mb-1" 
    style={{fontSize:"14px",paddingLeft:"1vw",paddingRight:"1vw",marginBottom:"0.5vw",minWidth:"16vw"}}> {data?.Email}</p>
    {/* <p className="px-7 font-normal ff-inter pb-2">Plan:<span className="text-[#0500ED]">premium</span></p> */}
    <hr style={{color:"#E9EDEC",opacity:0.5}} />
    <span style={{ display: 'flex', paddingLeft: '5px', marginBottom: '1px', cursor: 'pointer' }}>
      <img src={ProfileIcon} alt="" height={20} width={20} />&nbsp;
      <span style={{ fontFamily: "Inter", fontWeight: 400, paddingLeft: '3px',marginBottom:"5px", fontSize: '0.8rem', color: '#0C173A' }}>Profile</span>
    </span>
    <span style={{ display: 'flex', paddingLeft: '5px', marginBottom: '1px', cursor: 'pointer' }}>
      <img src={Settings} alt="" height={20} width={20} />&nbsp;
      <span style={{ fontFamily: "Inter", fontWeight: 400, paddingLeft: '3px',marginBottom:"5px", fontSize: '0.8rem', color: '#0C173A' }}>Settings</span>
    </span>
    <span style={{ display: 'flex', paddingLeft: '5px', marginBottom: '1px', cursor: 'pointer' }}>
      <img src={Bell} alt="" height={20} width={20} />&nbsp;
      <span style={{ fontFamily: "Inter", fontWeight: 400, paddingLeft: '3px',marginBottom:"5px", fontSize: '0.8rem', color: '#0C173A' }}>Notifications</span>
    </span>
    <hr style={{color:"#E9EDEC",opacity:0.5}} />
    <span style={{ display: 'flex', paddingLeft: '5px', marginBottom: '1px', cursor: 'pointer' }}>
      <img src={Help} alt="" height={20} width={20} />&nbsp;
      <span style={{ fontFamily: "Inter", fontWeight: 400, paddingLeft: '3px',marginBottom:"5px", fontSize: '0.8rem', color: '#0C173A' }}>Help Center</span>
    </span>
    <span style={{ display: 'flex', paddingLeft: '5px', marginBottom: '1px', cursor: 'pointer' }}>
      <img src={PrductTour} alt="" height={20} width={20} />&nbsp;
      <span style={{ fontFamily: "Inter", fontWeight: 400, paddingLeft: '3px',marginBottom:"5px", fontSize: '0.8rem', color: '#0C173A' }}>Product Tour</span>
    </span>
    <span style={{ display: 'flex', paddingLeft: '5px', marginBottom: '1px', cursor: 'pointer' }}>
      <img src={LeaveFeedback} alt="" height={20} width={20} />&nbsp;
      <span style={{ fontFamily: "Inter", fontWeight: 400, paddingLeft: '3px',marginBottom:"5px", fontSize: '0.8rem', color: '#0C173A' }}>Leave Feedback</span>
    </span>
    <hr style={{color:"#E9EDEC",opacity:0.5}} />
    <span onClick={logout} style={{ display: 'flex', paddingLeft: '5px', marginBottom: '1px', cursor: 'pointer' }}>
      <img src={LogoutIcon} alt="" height={20} width={20} />&nbsp;
      <span style={{ fontFamily: "Inter", fontWeight: 400, paddingLeft: '3px',marginBottom:"5px", fontSize: '0.8rem', color: '#0C173A' }}>Logout</span>
    </span>
  </div>
  );

  const onTopMenu = (item)=> ()=>{
    setIframeUrl(null)
    if(authHeaders.Enterprise){
      setGlobalStore({ loading: true });
      localStorage.setItem("selectecMianMenuItem", JSON.stringify(item.key))
      item.children.sort((a, b) => {
        const x = a.seqno !== null ? parseInt(a.seqno) : a.seqno;
        const y = b.seqno !== null ? parseInt(b.seqno) : b.seqno;
        return (x != null ? x : Infinity) - (y != null ? y : Infinity);
      });
      if(item.children[0].children===undefined){
        localStorage.removeItem("lowerSubMenu")
        localStorage.setItem("subMenuItem", JSON.stringify(item.children[0].key))
      }
      localStorage.setItem("subMenuData", JSON.stringify(item.children));
      if (item.children[0].type === "Report") {
        localStorage.setItem("windowType","Report")
        history.push(`/reports/report/${item.children[0].id}`);
      } else if (item.children[0].type === "Dashboard") {
        localStorage.setItem("windowType","Dashboard")
        history.push(`/analytics/dashboard/${item.children[0].id}`);
      } else if (item.children[0].type === "Generic") {
        history.push(`/window/list/${item.children[0].id}`);
      } else if (item.children[0].type === "Custom") {
        history.push(`/others/window/${item.children[0].id}`);
      }else if (item.children[0].type === "External") {
        console.log("item====>",item,item.children[0].navigation)
        if(item.children[0].navigation === "NewTab") {
          console.log("item====>",item.children[0].navigation)
          window.open(`${item.children[0].url}`)
        }else if (item.children[0].navigation === "EmbeddedView") {
          setIframeUrl(item.children[0].url)
        }else if (item.children[0].navigation === "popopWindow"){
          const popupUrl = item.children[0].url; 
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
            location=no
          `;
          window.open(popupUrl, "popupWindow", popupOptions);
        }
      } else if (item.children[0].children[0].type === "Generic") {
        localStorage.setItem("lowerSubMenu",JSON.stringify(item.children[0].children))
        localStorage.setItem("lowerSubMenuItem",item.children[0].children[0].title)
        localStorage.setItem("subMenuItem",JSON.stringify(item.children[0].key));
        history.push(`/window/list/${item.children[0].children[0].id}`);
      }  
      setGlobalStore({ loading: false });
    }else{
      handleSession(item)
    }
  }

  const selectReportMenuSearch = (value) => {
    history.push(`/reports/report/${value}`);
  };

  const NavigateToMenu = (menuType, menuId, menuTitle) => {
    setIframeUrl(null)
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
      case "External":
        if(menuTitle === "NewTab"){
          window.open(`${menuId}`)
        }else if (menuTitle === "EmbeddedView"){
          setIframeUrl(menuId)
        }
           break;  
      default:
        message.warning("Not Available");
        break;
    }
    history.push(navigationUrl);
  };

  const onTogMenu = () => {
    if (mobMenu === true) {
      setMobMenu(false)
    } setMobMenu(true)
  }

  // const selectMenuToNavigate = (value, data) => {
  //   // console.log("value, data========>",value)
  //   // console.log("data===========>",data)
  //   menuData.map(menu=>{
  //     menu.children.map(res=>{
  //       console.log("res.id==========>",res.id)
  //       if(res.id===data.key1){
  //         console.log("called===========>")
  //         localStorage.setItem("subMenuData", JSON.stringify(menu.children))
  //         localStorage.setItem("subMenuItem", JSON.stringify(res.key))
  //         localStorage.setItem("selectecMianMenuItem", JSON.stringify(menu.key))
  //         localStorage.setItem("lowerSubMenu",res.children?res.children:null)
  //       }else{
  //         console.log("inside else block")
  //       }
  //     })
  //   })

  //   const valueData = value.split("@");
  //   if (valueData.length > 0) {
  //     NavigateToMenu(valueData[1], data.key1, data.children);
  //   }
  // };

  const selectMenuToNavigate = (value, data) => {
    subMenuData?.map(menu => {
      menu?.children?.map(res => {
        if (res.id === data.key1) {
          // localStorage.setItem("subMenuData", JSON.stringify(menu.children))
          localStorage.setItem("subMenuItem", JSON.stringify(menu.key))
          localStorage.setItem("selectecMianMenuItem", JSON.stringify(menu.id))
          localStorage.setItem("lowerSubMenuItem", JSON.stringify(res.key))
          menu?.children?.sort((a, b) => {
            const x = a.seqno !== null ? parseInt(a.seqno) : a.seqno;
            const y = b.seqno !== null ? parseInt(b.seqno) : b.seqno;
            return (x != null ? x : Infinity) - (y != null ? y : Infinity);
          });
          localStorage.setItem("lowerSubMenu", menu.children ? JSON.stringify(menu.children) : null)
        } else {
          // console.log("inside else block")
        }
      })
    })

    const valueData = value.split("@");
    if (valueData.length > 0) {
      NavigateToMenu(valueData[1], data.key1, data.children);
    }
  };

  const selectMenuToNavigateforEnt = (value, data) => {
    setIframeUrl(null)
    const valueData = value.split("@");
    menuData.map(menu=>{
      menu.children.map(res=>{
        if(res.id == data.key1){
          localStorage.setItem("subMenuData", JSON.stringify(menu.children))
          localStorage.setItem("subMenuItem", JSON.stringify(res.key))
          localStorage.setItem("selectecMianMenuItem", JSON.stringify(menu.key))
          localStorage.setItem("lowerSubMenu",null)
          localStorage.setItem("lowerSubMenuItem",data.key)
          setMenuToggle(true)
        }else{
          res?.children?.map(child=>{
            if(child.id == data.key1){
              localStorage.setItem("subMenuData", JSON.stringify(menu.children))
              localStorage.setItem("subMenuItem", JSON.stringify(res.key))
              localStorage.setItem("selectecMianMenuItem", JSON.stringify(menu.key))
              localStorage.setItem("lowerSubMenu",JSON.stringify(res.children?res.children:null))
              localStorage.setItem("lowerSubMenuItem", child.title);
            }
          })
        }
        // if(res.id===data.key1){
        //   localStorage.setItem("subMenuData", JSON.stringify(menu.children))
        //   localStorage.setItem("subMenuItem", JSON.stringify(res.id))
        //   localStorage.setItem("selectecMianMenuItem", JSON.stringify(menu.id))
        //   localStorage.setItem("lowerSubMenu",res.children?res.children:null)
        // }else{
        //   console.log("inside else block")
        // }
      })
    })

    if (valueData.length > 0 && valueData[1] !== "External") {
      NavigateToMenu(valueData[1], data.key1, data.children);
    }else{
      if (data.key2 === "NewTab"){
        NavigateToMenu(valueData[1], data.key3,data.key2)
      }else if (data.key2 === "EmbeddedView"){
        setIframeUrl(data.key3)
      }else if (data.key2 === "popopWindow"){
        const popupUrl = data.key3; 
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
          location=no
        `;
        window.open(popupUrl, "popupWindow", popupOptions);
      }
    }
  };

  const subMenuNavigate = (data) => {
    setIframeUrl(null)
    if (data.children === undefined || data.children === null) {
      localStorage.setItem("subMenuItem", JSON.stringify(data.key))
      localStorage.setItem("lowerSubMenu", null)
      localStorage.setItem("lowerSubMenuItem",data.title)
      localStorage.setItem("windowType", data.type)
      setMenuToggle(true)
      setFullMenuToggle(true)
      if (data.type === "Report") {
        history.push(`/reports/report/${data.id}`);
      } else if (data.type === "Dashboard") {
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
          const popupUrl = data.key3; 
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
      }
    }
    else {
      data?.children?.sort((a, b) => {
        const x = a.seqno !== null ? parseInt(a.seqno) : a.seqno;
        const y = b.seqno !== null ? parseInt(b.seqno) : b.seqno;
        return (x != null ? x : Infinity) - (y != null ? y : Infinity);
      });
      setMenuToggle(false)
      localStorage.setItem("lowerSubMenu", JSON.stringify(data.children))
      localStorage.setItem("lowerSubMenuItem", data.children[0].title)
      localStorage.setItem("subMenuItem", JSON.stringify(data.key))
      localStorage.setItem("windowType", data.type)
      if (data.children[0].type === "Report") {
        localStorage.setItem("windowType", "Report")
        history.push(`/reports/report/${data.children[0].id}`);
      } else if (data.children[0].type === "Dashboard") {
        localStorage.setItem("windowType", "Dashboard")
        history.push(`/analytics/dashboard/${data.children[0].id}`);
      } else if (data.children[0].type === "Generic") {
        history.push(`/window/list/${data.children[0].id}`);
      } else if (data.children[0].type === "Custom") {
        history.push(`/others/window/${data.children[0].id}`);
      }else if (data.children[0].type === "External"){
        if(data.navigation === "NewTab"){
          window.open(`${data.url}`)
        }
      }
    }
  };



  const handleReportssList = () => {
    history.push("/reports");
  }

  const reportMenuContent = (
    <div style={{ width: "18em", height: "220px" }}>
      <div>
        <Select
          showSearch
          style={{ width: "100%", paddingRight: "8px" }}
          suffixIcon={<i className="fa fa-search" role="presentation" aria-hidden="true" style={Themes.sideMenu.sideMenuSearchIcon} />}
          onSelect={selectReportMenuSearch}
          value={null}
          filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          listHeight={180}
          allowClear={true}
          placeholder={
            <Row>
              <Col span={4}>
                <i className="fa fa-search" role="presentation" aria-hidden="true" style={Themes.sideMenu.sideMenuSearchIcon} />
              </Col>
            </Row>
          }
          showArrow={false}
          className="search-arrow placeHolder"
        >
          {getFilteredMenuData(menuData, "Report").map((menu, index) =>
            menu.children ? (
              getFilteredSubMenuData(menu.children, "Report").map((subMenuItem) => (
                <Option key={subMenuItem.id} value={subMenuItem.id}>
                  {subMenuItem.title}
                </Option>
              ))
            ) : (
              <Option key={menu.id} value={menu.id}>
                {menu.title}
              </Option>
            )
          )}
        </Select>
      </div>
      <Scrollbars
        style={{
          height: "190px",
        }}
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={200}
        thumbSize={90}
        renderView={renderView}
        renderThumbHorizontal={renderThumb}
        renderThumbVertical={renderThumb}
      >
        <Menu theme="light" mode="inline">
          {getFilteredMenuData(menuData, "Report").map((menu) => (
            <SubMenu
              key={`${menu.key}`}
              icon={
                <span className={menu.icon} style={{ color: "#666666" }}>
                  &ensp;
                </span>
              }
              title={`${menu.title}`}
            >
              {menu.children
                ? getFilteredSubMenuData(menu.children, "Report")
                  .sort((a, b) => (a.title > b.title ? 1 : -1))
                  .map((subMenuItem, index) => (
                    <Menu.Item key={`${subMenuItem.key}-${index}`} onClick={() => onReports(subMenuItem)} title={subMenuItem.title}>
                      {subMenuItem.title}
                    </Menu.Item>
                  ))
                : null}
            </SubMenu>
          ))}
        </Menu>
      </Scrollbars>
    </div>
  );

  const handleDashboardsList = () => {
    history.push("/dashboards");
  }

  const dashboardMenuContent = (
    <div style={{ width: "18em", height: "250px", marginRight: "-10px" }}>
      <Input
        style={{ width: "100%", paddingRight: "8px" }}
        prefix={<i className="fa fa-search" role="presentation" aria-hidden="true" style={Themes.sideMenu.sideMenuSearchIcon} />}
        value={dashBoardSearchInput}
        onChange={(e) => setDashBoardSearchInput(e.target.value)}
        allowClear={true}
      />
      <Scrollbars
        style={{
          height: "220px",
        }}
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={200}
        thumbSize={90}
        renderView={renderView}
        renderThumbHorizontal={renderThumb}
        renderThumbVertical={renderThumb}
      >
        {dashboardMenuData.map((menu) => {
          return (
            <div
              style={{
                height: "90px",
                width: "100px",
                border: "0px solid gray",
                backgroundColor: "#F5F5F5",
                display: "inline-block",
                borderRadius: "5px",
                paddingBottom: "20px",
                fontSize: "11px",
                paddingTop: "20px",
                margin: "10px",
                paddingLeft: "10px",
                paddingRight: "10px",
                textAlign: "center",
                verticalAlign: "middle",
                cursor: "pointer",
              }}
              id={menu.id}
              onClick={() => dashBoardNavigate(menu.id)}
            >
              {menu.title}
            </div>
          );
        })}
      </Scrollbars>
    </div>
  );

  const responsiveDesignNew = {
    xxl: 24,
    xl: 24,
    lg: 24,
    xs: 24,
    sm: 24,
    md: 24,
  };

  const responsiveDesignForColumn = {
    xxl: 10,
    xl: 10,
    lg: 10,
    xs: 6,
    sm: 6,
    md: 6,
  };

  const responsiveSearch = {
    xxl: 9,
    xl: 9,
    lg: 9,
    xs: 8,
    sm: 8,
    md: 6,
  };
  const globalSearch = {
    xxl: 5,
    xl: 5,
    lg: 5,
    xs: 0,
    sm: 16,
    md: 12,
  };

  const responsiveSearch1 = {
    xxl: 14,
    xl: 14,
    lg: 14,
    xs: 8,
    sm: 8,
    md: 16,
  };
  const responsiveMenuToggle = {
    xxl: 0,
    xl: 0,
    lg: 0,
    xs: 8,
    sm: 8,
    md: 0,
  }
  const forCollapse = {
    xxl: 0,
    xl: 0,
    lg: 0,
    xs: 24,
    sm: 24,
    md: 0,
  }

  const responsiveToggle = {
    xxl: 23,
    xl: 23,
    lg: 23,
    xs: 0,
    sm: 0,
    md: 23,
  };

  const responsiveIcons = {
    xxl: 0,
    xl: 0,
    lg: 0,
    xs: 0,
    sm: 0,
    md: 0,
  };

  const responsiveUserText = {
    xxl: 8,
    xl: 8,
    lg: 10,
    xs: 0,
    sm: 0,
    md: 24,
  };

  const responsiveUserIcon = {
    xxl: 0,
    xl: 0,
    lg: 0,
    xs: 8,
    sm: 8,
    md: 0,
  };

  const responsiveUserIconDown = {
    xxl: 0,
    xl: 0,
    lg: 0,
    xs: 12,
    sm: 12,
    md: 0,
  };

  const responsiveSpace = {
    xxl: 0,
    xl: 0,
    lg: 0,
    xs: 14,
    sm: 14,
    md: 0,
  };

  const moreMenu = (
    <Col {...responsiveDesignNew} style={{ height: "125px", width: "110px", paddingLeft: "15px" }}>
      {/* <Row>
        <Popover
          title={<p style={{ paddingBottom: "0px", marginBottom: "0px", textAlign: "center" }}>Favourites</p>}
          placement="bottom"
          style={{ marginLeft: "120px" }}
          content={favMenuContent}
          trigger="hover"
          visible={favouritesVisible}
          onVisibleChange={handleFavouritesChange}
        >
          <p style={{ marginBottom: "5px" }}>Favourites</p>
        </Popover>
      </Row> */}
      <Row>
        <Popover
          title={<p style={{ paddingBottom: "0px", marginBottom: "0px", textAlign: "center" }}>Reports</p>}
          placement="bottom"
          style={{ marginLeft: "120px" }}
          content={reportMenuContent}
          trigger="hover"
          visible={reportsVisible}
          onVisibleChange={handleReportsChange}
        >
          <p style={{ marginBottom: "5px" }}>Reports</p>
        </Popover>
      </Row>
      <Row>
        <Popover
          title={<p style={{ paddingBottom: "0px", marginBottom: "0px", textAlign: "center" }}>Dashboards</p>}
          placement="bottom"
          style={{ marginLeft: "120px" }}
          content={dashboardMenuContent}
          trigger="hover"
          visible={visible}
          onVisibleChange={handleVisibleChange}
          onClick={handleDashboardsList}
        >
          <p style={{ marginBottom: "5px" }}>Dashboards</p>
        </Popover>
      </Row>
      {/* <Row onClick={getAdminMenus}>
        <Tooltip title="Settings">
          <p style={{ marginBottom: "5px" }}>Settings</p>
        </Tooltip>
      </Row> */}
    </Col>
  );

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }
  const innerWidth = windowSize.innerWidth
  let selectecMianMenuItem
  // let selectecMianMenuItem = JSON.parse(localStorage.getItem("selectecMianMenuItem"))
  if(authHeaders.Enterprise){
     selectecMianMenuItem = JSON.parse(localStorage.getItem("selectecMianMenuItem"))
  }else{
     selectecMianMenuItem = localStorage.getItem("appId");
  }
  let subMenuItem = JSON.parse(localStorage.getItem("subMenuItem"))
  let subMenuData = JSON.parse(localStorage.getItem("subMenuData"))
  let headerColor = null;
  let hideKey = null;
  let logoUrl = null;
  
  const primeColor = localStorage.getItem("primeColor");
  if (primeColor !== "undefined" && primeColor !== null) {
    headerColor = JSON.parse(primeColor);
  }
  
  const hideKeyValue = localStorage.getItem("hideKey");
  if (hideKeyValue !== "undefined" && hideKeyValue !== null) {
    hideKey = JSON.parse(hideKeyValue);
  }

  const logoUrlValue = localStorage.getItem("logoUrl");
if(logoUrlValue !== "undefined" && logoUrlValue !== null) {
  logoUrl = JSON.parse(logoUrlValue)
}

  const handleSession = (item) => async () => {
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
      if (item.appURL.includes(window.location.origin)) {
        if (item.newTab === "Y") {
          window.open(item.appURL);
        } else {
          history.push(`${item.appURL}`.replace(window.location.origin, ""));
        };
      } else {
        if (item.newTab === "Y") {
          window.open(item.appURL);
        } else {
          window.location.assign(`${item.appURL}`);
        };
      };
      // if (item.appURL.includes("https://core.cwcloud.in")) {
      //   if (item.newTab === "Y") {
      //     window.open(`${item.appURL}`.replace("https://core.cwcloud.in", "http://localhost:3002"));
      //   } else {
      //     history.push(`${item.appURL}`.replace("https://core.cwcloud.in", ""));
      //   };
      // } else {
      //   if (item.newTab === "Y") {
      //     window.open(item.appURL);
      //   } else {
      //     window.location.assign(`${item.appURL}`);
      //   };
      // };
    };
    setGlobalStore({ loading: false });
    // history.push(`/?appId=${encodeURIComponent(item.app_id)}&name=${encodeURIComponent(item.app)}`);
    // let url = `${item.appURL}?appId=${encodeURIComponent(item.app_id)}&name=${encodeURIComponent(item.app)}`;
    // let url = `http://localhost:3002/?appId=${encodeURIComponent(item.app_id)}&name=${encodeURIComponent(item.app)}`;
    // window.location.assign(url);
    // };
    // };
  };

  const removeSession = () => {
    localStorage.removeItem("authTokensFlag");
    localStorage.removeItem("authTokens");
    localStorage.removeItem("lowerSubMenu");
    localStorage.removeItem("selectecMianMenuItem");
    localStorage.removeItem("subMenuItem");
    localStorage.removeItem("subMenuData");
    localStorage.removeItem("appId");
    window.location.assign(`${APPSURL}`);
  };

  const contentMenu =  (
    <Menu
      key="1"
    >
      <Input style={{margin:'7px',width:'225px'}}  allowClear />
      {/* <Scrollbars
          style={{
            height: "35vh",
          }}
          autoHide
          autoHideTimeout={1000}
          autoHideDuration={200}
          thumbSize={90}
          renderView={renderView}
          renderThumbVertical={renderThumb}
        > */}
      <Card bodyStyle={{height:"35vh",padding:0}}>
      {menuData?.map((app,index) => {
        return (
            app.navbar === "N" ?
               <Menu.Item onClick={handleSession(app)} key={index} className="custom-menu-item"  style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Image preview={false} width={30} height={30} alt="card" src={app.imageurl !== null ? app.imageurl : '/images/cwsuite-logo.png'}/>
                   <span style={{ marginLeft: '10px',fontFamily:"Inter",fontWeight:500 }}> {app.app}</span> 
                   </div>
                </Menu.Item>
              :
              ""
            
          // </>
        )
      })}
     
      </Card>
      {/* </Scrollbars> */}
    </Menu>
  );

  return (
    <>
      {innerWidth > 768 ?
        <div style={{ height:  innerWidth > 576 ? hideKey?hideKey=="Y"?'100px':'13vh':'15vh' : '13vh' }}>
          <Row style={{ height: '5vh',   backgroundColor: headerColor?headerColor:"#2f3856",display:hideKey?hideKey=="Y"?"":"none":"" }}>
            <Col span={24}>
              <Menu selectedKeys={selectecMianMenuItem} className="firstMenu" onClick={getMainMenu} style={{  backgroundColor: headerColor?headerColor:"#2f3856", color: '#F5F5F5', lineHeight: '5vh', borderBottom: "none", height: "5vh", fontFamily: 'Inter', fontWeight: 400, width: '105vw', fontSize: "0.8125rem"}} mode="horizontal">
                <Menu.Item onClick={removeSession} key={"1"} style={{ paddingTop: "0px", paddingLeft: "2rem" }}><img src={appIcon} style={{height:"2.9vh",paddingLeft:"0.4em",paddingBottom:"2px"}} alt="" /></Menu.Item>
                {menuData?.map(menu => {
                  return (
                    // <Menu.Item onClick={() => navigateToFirstChild({ type: menu.children[0].type, id: menu.children[0].id, key: menu.children[0].key, children: menu.children[0].children})} key={menu.key}>{menu.title}</Menu.Item>
                    <Menu.Item onClick={authHeaders.Enterprise?onTopMenu(menu):handleSession(menu)} key={authHeaders.Enterprise?menu.key:menu.app_id} hidden={menu.appDataLoaded === "N" || menu.active === "N" ? true : false} id={`${history.location.pathname === "/others/window/7520" && menu.app === 'POS' ? 'step2' : ""}`}>{authHeaders.Enterprise?menu.title:menu.app}</Menu.Item>
                  )
                })}
              </Menu>
            </Col>
          </Row>
          <Row justify="space-between" style={{ height: innerWidth > 1004 ? "41px" : '42px', backgroundColor: "#FFFFFF", marginBottom: "2px" }}>
            <Col {...responsiveDesignForColumn}>
              <Row>
                <Col {...responsiveSearch1} style={{ marginTop: "-2px" }}>
                  {innerWidth > 1004 ?
                  <>
                    <img
                      onClick={goToHome}
                      style={{ cursor: "pointer", width: '47%', paddingLeft: '7%', paddingBottom: "3vh" }}
                      src={logoFromEnv?logoFromEnv:NewLogo}
                      alt="Logo"
                    /> 
                    {clientLogo?<img
                      onClick={goToHome}
                      style={{ cursor: "pointer", width: '35%', paddingLeft: '5%', paddingBottom: "2.2vh" }}
                      src={clientLogo?clientLogo:null}
                      alt="Logo"
                    />:null}
                    </>
                    :
                    <img
                      onClick={goToHome}
                      style={{ cursor: "pointer", width: '75%', paddingLeft: '8%', marginLeft: innerWidth < 576 ? "135%" : "" }}
                     src={logoUrl?logoUrl:NewLogo}
                      alt="Logo"
                    />
                  }

                </Col>
              </Row>
            </Col>
            <Col {...globalSearch} style={{ marginTop: innerWidth > 1004 ? "-7px" : "-7px" }}>
              <Select
                className="global-sel"
                showSearch
                style={{ width: "100%", padding: 0, borderRadius: '5px', borderColor: '#D1D1D1', border: '0.5px' }}
                value={null}
                onSelect={authHeaders.Enterprise?selectMenuToNavigateforEnt:selectMenuToNavigate}
                placeholder={
                  <Row style={{marginBottom:"1em" }}>
                    <Col style={{ textAlign: "right"}} span={1}>
                      <img src={SearchIcon} alt='' style={{  padding: "0px 2px 3px 0px", height: "3vh",marginBottom:"0.22em" }} />
                    </Col>
                    <Col span={23} style={{ color: '#0C173A', width: '100%', fontFamily: 'Inter', paddingLeft: 7, textAlign: 'left', fontWeight: 400,fontSize:"0.853em",lineHeight:"2.4em" }}>Search</Col>
                  </Row>
                }
                showArrow={false}
              // className="search-arrow placeHolder"
              >
                {
                  authHeaders.Enterprise?
                  menuData.map((menu) =>
                    menu.children ? (
                      <OptGroup label={<span style={{ fontSize: '13px', color: 'black' }}><strong>{menu.title}</strong></span>}>
                       {  menu.children.map((subMenuItem) =>
                        subMenuItem.children ? (
                          subMenuItem.children.map((lowerSubMenuItem) => (
                            <Option style={{fontSize:'12px',fontFamily:'Inter' }} key={lowerSubMenuItem.key} key1={lowerSubMenuItem.id} key2={lowerSubMenuItem.navigation} key3={lowerSubMenuItem.url} value={`${lowerSubMenuItem.title}@${lowerSubMenuItem.type}`}>
                              {lowerSubMenuItem.title}
                            </Option>
                          ))
                        ) : (
                          <Option style={{fontSize:'12px',fontFamily:'Inter'}} key={subMenuItem.key} key1={subMenuItem.id} key3={subMenuItem.url} key2={subMenuItem.navigation} value={`${subMenuItem.title}@${subMenuItem.type}`}>
                            {subMenuItem.title}
                          </Option>
                        )
                      )
                    }
                      </OptGroup>
                    ):(
                      <Option style={{fontSize:'12px',fontFamily:'Inter' }} key={menu.key} key1={menu.id} value={`${menu.title}@${menu.type}`}>
                        {menu.title}
                      </Option>
                    )
                  ):
                   subMenuData?.map((menu) => {
                    return menu.children ? (
                      <OptGroup
                        label={
                          <span style={{ fontSize: '13px', color: 'black' }}>
                            <strong>{menu.title}</strong>
                          </span>
                        }
                        key={menu.key}
                      >
                        {menu.children.map((subMenuItem) =>
                          subMenuItem.children ? (
                            subMenuItem.children.map((lowerSubMenuItem) => (
                              <Option
                                style={{ fontSize: '12px', fontFamily: 'Inter' }}
                                key={lowerSubMenuItem.key}
                                key1={lowerSubMenuItem.id}
                                value={`${lowerSubMenuItem.title}@${lowerSubMenuItem.type}`}
                              >
                                {lowerSubMenuItem.title}
                              </Option>
                            ))
                          ) : (
                            <Option
                              style={{ fontSize: '12px', fontFamily: 'Inter' }}
                              key={subMenuItem.key}
                              key1={subMenuItem.id}
                              value={`${subMenuItem.title}@${subMenuItem.type}`}
                            >
                              {subMenuItem.title}
                            </Option>
                          )
                        )}
                      </OptGroup>
                    ) : (
                      <Option
                        style={{ fontSize: '12px', fontFamily: 'Inter' }}
                        key={menu.key}
                        key1={menu.id}
                        value={`${menu.title}@${menu.type}`}
                      >
                        {menu.title}
                      </Option>
                    );
                  })
                }
                

              </Select>

            </Col>
            <Col {...responsiveSearch} style={{ marginTop: "-6px" }}>
              <Row justify='end'>
                {/* <Col {...responsiveSpace} /> */}
                {/* <Col   {...responsiveIcons} style={{ textAlign: "center" }}>
              <img src={ProfileIcon} style={{ borderRadius: "50%", cursor: "pointer" }} />
            </Col> */}
               <Col {...responsiveUserText} style={{ textAlign: "center", marginTop: '0px', flexBasis: "fit-content" }}>
                  <Popover overlayClassName="logout" overlayInnerStyle={{borderRadius:"10px"}}  content={content} style={{ width: "90%", display: "flex", flexDirection: "row", alignItems: "center" }} placement="bottom" arrowPointAtCenter >
                {Instance?
                    <div style={{ display: "flex" }}>
                      <img src={ProfileIcon} style={{ cursor: "pointer",width:"9.5%",paddingTop:"0.4vh" }} />&nbsp;&nbsp;
                      <span style={{ color: '#0C173A', whiteSpace: "nowrap", fontFamily: 'Open Sans', fontWeight: 'bold',fontSize:"1em", textAlign: 'right', cursor: 'pointer' }}>
                        {data?.name} &nbsp; &nbsp;&nbsp;
                      </span>
                    </div>:
                     <div style={{ display: "flex" }}>
                     <img src={ProfileIcon} style={{ cursor: "pointer" }} />&nbsp;&nbsp;
                     <span style={{ color: '#0C173A', whiteSpace: "nowrap", fontFamily: 'Open Sans', fontWeight: 'bold', fontSize:"1em", textAlign: 'right', cursor: 'pointer' }}>
                       {data?.name?.split(" ")[0]} &nbsp; &nbsp;&nbsp;
                     </span>
                     </div>}
                  </Popover>
                </Col>
                <Col {...responsiveUserIconDown} />
                {/* <Col {...responsiveUserIcon} style={{ textAlign: "right", marginTop: "-10px" }}>
              <Dropdown trigger={["click"]} overlay={moreMenu}>
                <img style={{ cursor: "pointer", backgroundColor: '#FFFFFF' }} src={MoreNavs} preview={false} />
              </Dropdown>
            </Col> */}
                <Col {...responsiveUserIcon} style={{ textAlign: "center", marginTop: "-10px" }}>
                  <Popover content={content} trigger="click" placement="topRight">
                    <img style={{ cursor: "pointer", backgroundColor: '#FFFFFF' }} src={UserIcon} preview={false} />
                  </Popover>
                </Col>
              </Row>
            </Col>
          </Row>
          {innerWidth > 576 ?
            <Row style={{ height: '3vh' }}>
              <Col span={1} style={{ display:hideKey? hideKey=="Y"?"none":"flex":"none", flexDirection: "row", alignItems: "center", justifyContent: "center",marginTop:"-1em" }}>
              <span key={"1"}>
                <Popover
                  //  className="appsPop"
                  style={{ width: "90%", display: "flex", flexDirection: "row", alignItems: "center" }}
                  placement="bottomLeft"
                  // arrowPointAtCenter
                  content={contentMenu}
                >
                  <Image preview={false} src={MenuIconNav} alt="" />
                </Popover>
              </span>
            </Col>
              <Col {...responsiveToggle}>
                <Menu selectedKeys={subMenuItem} onClick={getSubMenu} className="secondMenu" style={{ backgroundColor: "white", lineHeight: '3.4vh', height: "3vh", fontFamily: 'Inter', fontWeight: 400, alignItems: "center", opacity: '100%',fontSize: "0.8125rem" }} mode="horizontal">
                  {subMenuData?.map((subMenu) => {
                    return (
                      <Menu.Item
                      id={`${history.location.pathname === "/others/window/1003" ? subMenu.title === 'Home' ? 'step2' : ""
                      : history.location.pathname === '/window/7003/NEW_RECORD'
                      ?subMenu.title === 'Home' ? 'step2':""
                      :history.location.pathname === '/window/list/7001' && localStorage.getItem('appName') === 'Purchase'
                      ?subMenu.title === 'Purchase' ? 'step2':""
                      :history.location.pathname === '/window/list/7001' && localStorage.getItem('appName') === 'Inventory'
                      ?subMenu.title === 'Inventory' ? 'step2':""
                      :history.location.pathname === '/window/list/7001' && localStorage.getItem('appName') === 'Sales'
                      ?subMenu.title === 'Sales' ? 'step2':""
                      :""
                    }`}
                      key={subMenu.key} onClick={() => subMenuNavigate({ type: subMenu.type, id: subMenu.id, key: subMenu.key, children: subMenu.children,title:subMenu.title,url:subMenu.url,navigation:subMenu.navigation })}>{subMenu.title}</Menu.Item>
                    )
                  })}
                </Menu>
              </Col>
              <Col {...forCollapse} style={{ marginTop: '-13.5px', backgroundColor: '#FFFFFF' }}>&nbsp;&nbsp;&nbsp;
                <img src={ToggleIcon} style={{ cursor: 'pointer' }} onClick={onTogMenu} alt='' />&nbsp;&nbsp;&nbsp;
                <span style={{ fontFamily: 'Inter' }}>
                  {subMenuItem}
                </span>
              </Col>
            </Row> : ""}
          {/* <MobileMenu mobMenu={mobMenu} setMobMenu={setMobMenu}/> */}
        </div> :
        <div >
          <Row justify="space-around" style={{ height: showSearch ? '88px' : '50px' }}>
            <Col {...responsiveMenuToggle} style={{ paddingLeft: "1em", marginTop: "-0.6em" }}>
              <img src={ToggleIcon} style={{ cursor: "pointer", paddingBottom: "0.5px", width: "1.5em", height: "1.5em" }} onClick={onTogMenu} alt="" />
            </Col>
            <Col {...responsiveSearch1} style={{ marginTop: "-0.6em" }}>
              <img
                onClick={goToHome}
                style={{ cursor: "pointer", width: '60%', paddingLeft: '8%' }}
                src={NewLogo1}
                alt="Logo"
              />
            </Col>
            <Col {...responsiveSearch} style={{ marginTop: "-0.6em", float: "right" }}>
              <Row justify="space-between">
                <Col {...responsiveSpace} />
                <Col {...responsiveUserIcon} style={{ marginTop: "1.8em" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <img onClick={() => { setShowSearch((t) => !t) }} style={{ cursor: "pointer", backgroundColor: '#FFFFFF' }} src={mobileGlobalSearch} preview={false} />
                    <Popover content={content} trigger="click" placement="topRight">
                      <img style={{ cursor: "pointer", backgroundColor: '#FFFFFF' }} src={UserIconMobile} preview={false} />
                    </Popover>
                  </div>
                </Col>
                <Col span={2} />
                {/* <Col {...responsiveUserIcon} style={{marginRight:"0.3em"}}>
           
          </Col> */}

              </Row>
            </Col>
            <Col span={24} style={{ marginTop: "-2em", padding: "0 2em", display: showSearch ? "block" : "none" }}>
              <Select
                className="global-sel"
                showSearch
                style={{ width: "100%", padding: 0, borderRadius: '5px', borderColor: '#D7DADE', border: '0.5px' }}
                value={null}
                onSelect={selectMenuToNavigate}
                suffixIcon={
                  <CloseOutlined style={{ color: "#3D4561", cursor: "pointer" }} onClick={(ev) => { ev.stopPropagation(); setShowSearch((t) => !t) }} />
                }
                placeholder={
                  <Row>
                    <Col style={{ textAlign: "right" }} span={1}>
                      <img src={SearchIcon} alt='' style={{ opacity: 0.83, padding: "2px 2px 4px 2px", height: "19px" }} />
                    </Col>
                    <Col span={22} style={{ color: '#868B8F', width: '100%', fontFamily: 'Inter', paddingLeft: 7, textAlign: 'left', fontWeight: 400 }}>Search</Col>
                    {/* <Col style={{ textAlign: "right" }} onClick={(ev)=>{ev.stopPropagation()}} span={1} >
              <CloseOutlined style={{color:"#3D4561",cursor:"pointer"}}  onClick={(ev)=>{ev.stopPropagation();  setShowSearch((t)=>!t)}}/>
              </Col> */}
                  </Row>
                }
                showArrow={false}
              // className="search-arrow placeHolder"
              >
                {menuData.map((menu) =>
                  menu.children ? (
                    <OptGroup label={<span style={{ fontSize: '13px', color: 'black' }}><strong>{menu.title}</strong></span>}>
                      {menu.children.map((subMenuItem) =>
                        subMenuItem.children ? (
                          subMenuItem.children.map((lowerSubMenuItem) => (
                            <Option style={{ fontSize: '12px', fontFamily: 'Inter' }} key={lowerSubMenuItem.key} key1={lowerSubMenuItem.id} value={`${lowerSubMenuItem.title}@${lowerSubMenuItem.type}`}>
                              {lowerSubMenuItem.title}
                            </Option>
                          ))
                        ) : (
                          <Option style={{ fontSize: '12px', fontFamily: 'Inter' }} key={subMenuItem.key} key1={subMenuItem.id} value={`${subMenuItem.title}@${subMenuItem.type}`}>
                            {subMenuItem.title}
                          </Option>
                        )
                      )
                      }
                    </OptGroup>
                  ) : (
                    <Option style={{ fontSize: '12px', fontFamily: 'Inter' }} key={menu.key} key1={menu.id} value={`${menu.title}@${menu.type}`}>
                      {menu.title}
                    </Option>
                  )
                )}
              </Select>
            </Col>
          </Row>
          <MobileMenu mobMenu={mobMenu} setSelectedMainMenuItem={setSelectedMainMenuItem} setMobMenu={setMobMenu} menuData={menuData} />
        </div>
      }
    </>
  );
};

export default NavBar;
