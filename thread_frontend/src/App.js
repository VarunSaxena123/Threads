import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from './component/Login';
import SignUp from './component/SignUp';
import ShopPage from './component/ShopPage';
import ViewCart from './component/ViewCart';
function App() {
  return (
    <>
      <Route exact path="/" component={Login}/>
      <Route path="/signup" component={SignUp}/>
      <Route path="/ShopPage" component={ShopPage} />
      <Route path="/ViewCart" component={ViewCart}/>
     
      {/* 
      <List/>
      <LeaveForm/>
   <Switch>
      <Route exact path="/" component={Home}/>
      <Route path="/about" component={About}/>
      <Route path="/LeaveForm" component={LeaveForm}/>
      <Route path="/LeaveStatus" component={LeaveStatus}/>
      <Route path="/SignUp" component={SignUp}/>
      <Route component={error}/>
  </Switch>*/}
    </>
  )
}

export default App;
