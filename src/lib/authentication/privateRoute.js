import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { BrowserRouter as Router, Switch, Route, useLocation } from 'react-router-dom';
import { useGlobalContext } from "../storage";
import { getOAuthHeaders } from "../../constants/oAuthValidation";
import 'intro.js/introjs.css';
import IntroJS from 'intro.js';
import IntroCloseicon from '../../assets/images/introCloseIcon.png'
import { useHistory } from "react-router-dom";


const PrivateRoute = ({ component: Component, layout: Layout, ...rest }) => {
  const location = useLocation();
  const productTourSteps = localStorage.getItem("productTourSteps")
  const existingUser = localStorage.getItem('existingUser')

  useEffect(() => {
    const pageKey = `intro-tour-${window.location.pathname}`;
    const hasCompletedTour = localStorage.getItem(pageKey);
    if (!hasCompletedTour && (existingUser === null || existingUser === 'undefined')) {

      const jsonArray = JSON.parse(JSON.parse(productTourSteps));
      let currentPageSteps = [];
  
       if (jsonArray && Array.isArray(jsonArray)) {
        jsonArray.forEach((data) => {
          if(data.appId === localStorage.getItem('appId')){
            data.data.forEach((stepsData)=>{
              if (stepsData.page === window.location.pathname || stepsData.page + '/' === window.location.pathname) {
                currentPageSteps = stepsData.steps;
              }
            })
          } 
        });
      }
  
      let phoneImg = document.createElement('img');
      phoneImg.src = IntroCloseicon;
      phoneImg.alt = 'Skip tour';
  
      let intro = IntroJS().setOptions({
        steps: currentPageSteps,
        nextButton: 'my-next-button',
        prevButton: 'my-prev-button',
        // skipLabel: phoneImg.outerHTML
      });
      if (currentPageSteps.length === 1) {
        intro.setOption('showBullets', false);
      } else {
        intro.setOption('showBullets', true);
      }
      intro.oncomplete(() => {
        localStorage.setItem(pageKey, 'completed');
      });
  
      setTimeout(() => {
        intro.start();
      }, 2000);
    }
  }, [location]);
  useEffect(() => {
    const updateTitle = () => {
      const authHeaders = getOAuthHeaders();
      if (authHeaders && authHeaders.tenantName) {
        document.title = `${localStorage.getItem("appName")} - ${authHeaders.tenantName} - CW Suite`;
      };
    };
    updateTitle();
  }, [location]);
  let appName = localStorage.getItem("appName");
  const { globalStore } = useGlobalContext();
  const { authTokensFlag } = globalStore;
  return <Route {...rest} render={(props) => (authTokensFlag ? <Layout><Component {...props} /></Layout> : <Redirect to={{ pathname: `/${appName}`, state: { referer: props.location } }} />)} />;
};

export default PrivateRoute;
