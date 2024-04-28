import React, { useReducer,useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { GlobalContext, storeReducer } from "../lib/storage";
import PrivateRoute from "../lib/authentication/privateRoute";
import PopupLayout from "./popupLayout";
import AdminLayout from "./adminLayout";
import Login from "./login";
import HomePage from "./home";
import GenericWindow from "./window";
import Dashboard from "./analytics";
import Report from "./report";
import ImportRecord from "./import";
import { Integrations } from '@sentry/tracing';
import * as Sentry from '@sentry/react';
// import PurchaseOrder from "./customWindow/PurchaseOrder";
import StockAllocation from "./customWindow/StockAllocation";
import ProfitLossStatement from "./customWindow/ProfitLossStatement";
import BalanceSheet from "./customWindow/BalanceSheet";
import PivotSample from "./customWindow/PivotSample";
import Users from "./customWindow/Users";
import UserDetails from "./customWindow/Users/UserDetails";
import CreateRole from "./customWindow/Role/createNewRole";
import RoleDetails from "./customWindow/Role/RoleDetails";
import RoleListWindow from "./customWindow/Role/index";
import SqlQuery from "./customWindow/Sql_Query";
import AdvSqlQuery from "./customWindow/Sql_Advance_Query";
import SalesGPReport from "./customWindow/Sales_GP_Report";
import SalesGpReport from "./customWindow/SalesGPReport";
// import StockCount from "./customWindow/stockCount";
// import WastageEntry from "./customWindow/wastageEntry";
// import StIssue from "./customWindow/stIssue";
// import newStReceipt from "./customWindow/stReceipt"
// import PurchaseReturns from "./customWindow/purchaseReturn";
import PurchaseOrderApparel from "./customWindow/PurchaseOrderApparel";
import GSTR3BSummaryReport from "./customWindow/GSTR3BSummaryReport";
import ApplicationSetup from "./customWindow/applicationsetup";
import ManageRequisition from "./customWindow/ManageRequisition";
import ManageSalesOrder from "./customWindow/ManageSalesOrder";
// import GRN from "./customWindow/grn";
import POSConfiguration from "./customWindow/posconfiguration";
import NewSalesOrder from "./customWindow/newSalesOrder";
import ProductPriceUpdate from "./customWindow/ProductPriceUpdate";
import NewProductDesign from "./customWindow/NewProductDesign";
import PJCustom from "./customWindow/PJCustom";
import PJcustomDetails from "./customWindow/PJCustom/PJCustomerDetails"
import ErrorPage from "./errorBoundary/ErrorPage";
import PageNotFound from "./errorBoundary/PageNotFound";
import ReportDeveloper from "./customWindow/Report Developer";
import NewReport from "./customWindow/Report Developer/NewReport";
import ProfitLossSchedule3 from "./customWindow/Finance/Profit&Loss(schedule3)";
import AlertsandMessages from "./customWindow/alertsandmessages";
import ManageWorkOrder from "./customWindow/NewWorkOrer"
import ManageWorkRequest from "./customWindow/ManageWorkRequest"
import Profile from "./customWindow/profile"
import PendingQualityTask from "./customWindow/pendingQualityTask"
import PendingdetailsView from "./customWindow/pendingQualityTask/detailsView"
import QualityReview from "./customWindow/qualityReview"
import TrialBalance from "./customWindow/TrialBalance";
import DataLoadNewConfig from "./customWindow/initialDataLoadConfigNew"
import InitialDataLoadNew from "./customWindow/initialDataLoadNew"
import RetailSetup from "./customWindow/RetailSetup";
import resetPassword from "./login/resetPassword";
import QcDetailsView from "./customWindow/qualityReview/detailsView"
import DagTask from "./customWindow/DagTask";
import NewTask from "./customWindow/DagTask/NewTask";
import CwAnalytics from "./customWindow/CwAnalytics";
import CwConnections from "./customWindow/CwConnections";
import DashboardList from "./customWindow/dashboardList";
import ReportsList from "./customWindow/ReportsList";
import PoSPlG from "./customWindow/posPLG";
import "../styles/app.css";
import "../styles/antd.css";
import Home from "./customWindow/Home";
import Preferences from "./customWindow/preferences";
import GetStarted from "./customWindow/getStarted";
import PurchaseGetStarted from "./customWindow/PurchaseGetStarted";
import SalesGetStarted from "./customWindow/SalesGetStarted";
// import InventoryGetStarted from "./customWindow/InventoryGetStarted";
import ManageStores from "./customWindow/getStarted/manageStores";
import manageStoreFormView from "./customWindow/getStarted/manageStoreFormView";
import UpsertTillAndUser from "./customWindow/getStarted/upsertTillAndUser";
import NewStockIssue from "./customWindow/newStockIssue"
import NewStockTransferReceipt from "./customWindow/stockTransferReceipt"
import Wastage from "./customWindow/wastage"
import NewStockCount from "./customWindow/newStockCount"
import GoodsReceipt from "./customWindow/goodsReceipt"
import QuickPurchaseOrder from "./customWindow/quickPurchaseOrder"
import QuickPurchaseReturn from "./customWindow/quickPurchaseReturn"
import QuickSalesOrder from "./customWindow/quickSalesOrder";
import GoodsShipment from "./customWindow/goodsShipment"
import QuickSalesReturn from "./customWindow/quickSalesReturn"
import AddProduct from "./customWindow/AddProduct";

const authTokensFlag = localStorage.getItem("authTokensFlag");
// const authTokens = JSON.parse(localStorage.getItem("authTokens"));
const logoutUrl = process.env.REACT_APP_logoutUrl;
const userData = JSON.parse(localStorage.getItem("userData"));
const sideMenuData = JSON.parse(localStorage.getItem("sideMenuData"));
const userPreferences = JSON.parse(localStorage.getItem("userPreferences"));
const globalPreferences = JSON.parse(localStorage.getItem("globalParameters"))
const windowTabs = JSON.parse(localStorage.getItem("windowTabs"));
let loading = false;
const SentryDSN = process.env.REACT_APP_SENTRY_DSN;
const SentryEnabled = process.env.REACT_APP_ENABLE_SENTRY;
const environment = process.env.REACT_APP_Sentry_Environment;

const App = () => {
  function LightenDarkenColor(col, amt) {

    var usePound = false;

    if (col[0] == "#") {
      col = col.slice(1);
      usePound = true;
    }

    var num = parseInt(col, 16);

    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);

  }



  if (userData !== null) {
    let NewColor = LightenDarkenColor(userData.CW360_V2_UI.appTheme?.primaryColor, 225);
    window.less
      .modifyVars({
        "@primary-color": userData.CW360_V2_UI.appTheme.themePrimaryColor,
        "@table-header-color": userData.CW360_V2_UI.appTheme.tableColumColor, // for table header
        "@table-header-bg": userData.CW360_V2_UI.appTheme.tableColumnBackground, // table coloumn background
        "@text-color": userData.CW360_V2_UI.appTheme.primeryTextColor, // overall text color
        "@tabs-card-head-background": userData.CW360_V2_UI.appTheme.tabsCardBackground, // for tab
        "@label-color": userData.CW360_V2_UI.appTheme.formLabelColor, // label color
        "@btn-primary-bg": userData.CW360_V2_UI.appTheme.primaryColor,
        "@layout-body-background": NewColor,
        '@font-size-base': userData.CW360_V2_UI.appTheme.baseFontSize, // major text font size
      })
  }else{
    localStorage.clear();
    window.location.assign(`${logoutUrl}`);
  }

  const [globalStore, setGlobalStore] = useReducer(storeReducer, {
    // authTokens: authTokens,
    authTokensFlag: authTokensFlag,
    userData: userData,
    sideMenuData: sideMenuData,
    userPreferences: userPreferences,
    globalPreferences: globalPreferences,
    windowTabs: windowTabs ? windowTabs : [],
    loading: loading
  });

  const getQueryParams = (location) => {
    const searchParams = new URLSearchParams(location.search);
    const params = {};
    for (const [key, value] of searchParams) {
      params[key] = value;
    }
    return params;
  };

  const location = window.location;
  const params = getQueryParams(location);
  if (params?.name && params?.appId) {
    // localStorage.setItem("email", decodeURIComponent(params?.email));
    // localStorage.setItem("tenantId", decodeURIComponent(params?.tenantId));
    localStorage.setItem("appId", decodeURIComponent(params?.appId));
    localStorage.setItem("appName", decodeURIComponent(params?.name));
    // localStorage.setItem("authTokens", JSON.stringify(params?.token));
    // localStorage.setItem("refreshToken", JSON.stringify(params?.refresh));
  };

  useEffect(() => {
    if(SentryEnabled){
      Sentry.init({
        environment:environment,
        dsn: SentryDSN,
        integrations: [
          new Integrations.BrowserTracing(),
        ],
        tracesSampleRate: 1.0,
      });
    }
    // Log a message to Sentry
    
  }, []);

  return (
    <GlobalContext.Provider value={{ globalStore, setGlobalStore }}>
      <Router>
        <Switch>
          <PrivateRoute exact path="/" layout={AdminLayout} component={HomePage} />
          <Route exact path="/:appName" component={Login} />
          <Route exact path="/NewPassword" component={resetPassword}></Route>
          <PrivateRoute exact path="/window/list/:windowId" layout={AdminLayout} component={GenericWindow} />
          <PrivateRoute exact path="/window/:windowId/:recordId" layout={AdminLayout} component={GenericWindow} />
          <PrivateRoute exact path="/popupWindow/:windowId/:recordId" layout={PopupLayout} component={GenericWindow} />
          <PrivateRoute exact path="/popupWindow/others/window/7359" layout={PopupLayout} component={NewStockCount} />
          <PrivateRoute exact path="/analytics/dashboard/:dashboardId" layout={AdminLayout} component={Dashboard} />
          <PrivateRoute exact path="/reports/report/:reportId" layout={AdminLayout} component={Report} />
          {/* <PrivateRoute exact path="/others/window/7137" layout={AdminLayout} component={PurchaseOrder} /> */}
          <PrivateRoute exact path="/others/window/7371" layout={AdminLayout} component={StockAllocation} />
          <PrivateRoute exact path="/others/window/7396" layout={AdminLayout} component={ProfitLossStatement} />
          <PrivateRoute exact path="/others/window/7404" layout={AdminLayout} component={BalanceSheet} />
          <PrivateRoute exact path="/others/window/7406" layout={AdminLayout} component={PivotSample} />
          <PrivateRoute exact path="/others/window/7198" layout={AdminLayout} component={Users} />
          <PrivateRoute exact path="/others/window/userDetails" layout={AdminLayout} component={UserDetails} />
          <PrivateRoute exact path="/others/window/7199" layout={AdminLayout} component={RoleListWindow} />
          <PrivateRoute exact path="/others/window/CreateRole" layout={AdminLayout} component={CreateRole} />
          <PrivateRoute exact path="/others/window/RoleDetails" layout={AdminLayout} component={RoleDetails} />
          {/* <PrivateRoute exact path="/others/window/7359" layout={AdminLayout} component={StockCount} /> */}
          {/* <PrivateRoute exact path="/others/window/7360" layout={AdminLayout} component={WastageEntry} /> */}
          {/* <PrivateRoute exact path="/others/window/7295" layout={AdminLayout} component={StIssue} /> */}
          {/* <PrivateRoute exact path="/others/window/7296" layout={AdminLayout} component={newStReceipt} /> */}
          <PrivateRoute exact path="/others/window/7407" layout={AdminLayout} component={PurchaseOrderApparel} />
          {/* <PrivateRoute exact path="/others/window/7363" layout={AdminLayout} component={GRN} /> */}
          {/* <PrivateRoute exact path="/others/window/7424" layout={AdminLayout} component={PurchaseReturns} /> */}
          <PrivateRoute exact path="/others/window/7257" layout={AdminLayout} component={SqlQuery} />
          <PrivateRoute exact path="/others/window/7293" layout={AdminLayout} component={AdvSqlQuery} />
          <PrivateRoute exact path="/others/window/7208" layout={AdminLayout} component={ImportRecord} />
          <PrivateRoute exact path="/others/window/7301" layout={AdminLayout} component={SalesGPReport} />
          <PrivateRoute exact path="/others/window/7412" layout={AdminLayout} component={SalesGpReport} />
          <PrivateRoute exact path="/others/window/7417" layout={AdminLayout} component={GSTR3BSummaryReport} />
          <PrivateRoute exact path="/others/window/7430" layout={AdminLayout} component={ApplicationSetup} />
          <PrivateRoute exact path="/others/window/7426" layout={AdminLayout} component={ManageRequisition} />
          <PrivateRoute exact path="/others/window/7425" layout={AdminLayout} component={ManageSalesOrder} />
          <PrivateRoute exact path="/others/window/7435" layout={AdminLayout} component={POSConfiguration} />
          <PrivateRoute exact path="/others/window/7439" layout={AdminLayout} component={NewSalesOrder} />
          <PrivateRoute exact path="/others/window/7439/:recordId" layout={AdminLayout} component={NewSalesOrder} />
          <PrivateRoute exact path="/others/window/7567/:recordId" layout={AdminLayout} component={AddProduct} />
          <PrivateRoute exact path="/others/window/7444" layout={AdminLayout} component={ProductPriceUpdate} />
          <PrivateRoute exact path="/others/window/7447" layout={AdminLayout} component={NewProductDesign} />
          <PrivateRoute exact path="/others/window/7447/:recordId" layout={AdminLayout} component={NewProductDesign} />
          <PrivateRoute exact path="/others/window/7452" layout={AdminLayout} component={PJCustom} />
          <PrivateRoute exact path="/others/window/PJCustomerDetails" layout={AdminLayout} component={PJcustomDetails} />
          <PrivateRoute exact path="/others/window/7459" layout={AdminLayout} component={InitialDataLoadNew} />
          <PrivateRoute exact path="/others/window/7460" layout={AdminLayout} component={DataLoadNewConfig} />
          <PrivateRoute exact path="/others/window/7473" layout={AdminLayout} component={ManageWorkOrder} />
          <PrivateRoute exact path="/others/window/7473/:recordId" layout={AdminLayout} component={ManageWorkOrder} />
          <PrivateRoute exact path="/others/window/7472" layout={AdminLayout} component={ManageWorkRequest} />
          <PrivateRoute exact path="/others/window/7464" layout={AdminLayout} component={ReportDeveloper} />
          <PrivateRoute exact path="/others/window/8000" layout={AdminLayout} component={Home} />
          <PrivateRoute exact path="/others/window/7464/:reportId" layout={AdminLayout} component={NewReport} />
          <PrivateRoute exact path="/others/window/7467" layout={AdminLayout} component={ProfitLossSchedule3} />
          <Route exact path="/alerts" component={AlertsandMessages} />
          <PrivateRoute exact path="/others/window/7465" layout={AdminLayout} component={Profile} />
          <PrivateRoute exact path="/others/window/7475" layout={AdminLayout} component={PendingQualityTask} />
          <PrivateRoute exact path="/others/window/7475/:recordId" layout={AdminLayout} component={PendingdetailsView} />
          <PrivateRoute exact path="/others/window/7478" layout={AdminLayout} component={QualityReview} />
          <PrivateRoute exact path="/others/window/7478/:recordId" layout={AdminLayout} component={QcDetailsView} />
          <PrivateRoute exact path="/others/window/7474" layout={AdminLayout} component={TrialBalance} />
          <PrivateRoute exact path="/others/window/7477" layout={AdminLayout} component={RetailSetup} />
          <PrivateRoute exact path="/others/window/7484" layout={AdminLayout} component={DagTask} />
          <PrivateRoute exact path="/others/window/7484/:taskId" layout={AdminLayout} component={NewTask} />
          <PrivateRoute exact path="/others/window/7485" layout={AdminLayout} component={CwAnalytics} />
          <PrivateRoute exact path="/others/window/7486" layout={AdminLayout} component={CwConnections} />
          <PrivateRoute exact path="/others/window/7515" layout={AdminLayout} component={PoSPlG} />
          <PrivateRoute exact path="/others/window/7520/:recordId" layout={AdminLayout} component={Preferences} />
          <PrivateRoute exact path="/others/window/7520" layout={AdminLayout} component={Preferences} />
          <PrivateRoute exact path="/others/window/7521" layout={AdminLayout} component={GetStarted} />
          <PrivateRoute exact path="/others/window/7527" layout={AdminLayout} component={PurchaseGetStarted} />
          <PrivateRoute exact path="/others/window/7528" layout={AdminLayout} component={SalesGetStarted} />
          {/* <PrivateRoute exact path="/others/window/7529" layout={AdminLayout} component={InventoryGetStarted} /> */}
          <PrivateRoute exact path="/others/window/1001" layout={AdminLayout} component={ManageStores} />
          <PrivateRoute exact path="/others/window/1002" layout={AdminLayout} component={manageStoreFormView} />
          <PrivateRoute exact path="/others/window/1003" layout={AdminLayout} component={UpsertTillAndUser} />

          <PrivateRoute exact path="/others/window/7295" layout={AdminLayout} component={NewStockIssue} />
          <PrivateRoute exact path="/others/window/7296" layout={AdminLayout} component={NewStockTransferReceipt} />
          <PrivateRoute exact path="/others/window/7360" layout={AdminLayout} component={Wastage} />
          <PrivateRoute exact path="/others/window/7359" layout={AdminLayout} component={NewStockCount} />
          <PrivateRoute exact path="/others/window/7363" layout={AdminLayout} component={GoodsReceipt} />
          <PrivateRoute exact path="/others/window/7137" layout={AdminLayout} component={QuickPurchaseOrder} />
          <PrivateRoute exact path="/others/window/7424" layout={AdminLayout} component={QuickPurchaseReturn} />
          <PrivateRoute exact path="/others/window/7530" layout={AdminLayout} component={QuickSalesOrder} />
          <PrivateRoute exact path="/others/window/7531" layout={AdminLayout} component={GoodsShipment} />
          <PrivateRoute exact path="/others/window/7532" layout={AdminLayout} component={QuickSalesReturn} />

          <PrivateRoute exact path="/dashboards" layout={AdminLayout} component={DashboardList} />
          <PrivateRoute exact path="/reports" layout={AdminLayout} component={ReportsList} />
          <PrivateRoute exact path="/error" layout={AdminLayout} component={ErrorPage} />
          <PrivateRoute path="*" layout={AdminLayout} component={PageNotFound} />
        </Switch>
      </Router>
    </GlobalContext.Provider>
  );
};

export default App;