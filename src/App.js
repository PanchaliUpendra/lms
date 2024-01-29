import React, { useContext } from 'react'
import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Login from './Login/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import MyContext from './MyContext';
import Managelead from './Components/Managelead/Createlead/Managelead';
import Error from './Error/Error';
import Viewlead from './Components/Managelead/Viewlead/Viewlead';
import Createticket from './Components/Manageticket/Createticket/Createticket';
import Viewticket from './Components/Manageticket/Viewticket/Viewticket';
import Createmanager from './Components/Managemanager/Createmanager/Createmanager';
import Viewmanager from './Components/Managemanager/Viewmanager/Viewmanager';
import Createemployee from './Components/Manageemployee/Createemployee/Createemployee';
import Viewemployee from './Components/Manageemployee/Viewemployee/Viewemployee';
import Createfinance from './Components/Managefinance/Createfinance/Createfinance';
import Viewfinance from './Components/Managefinance/Viewfinance/Viewfinance';
import Createcustomer from './Components/Managecustomer/Createcustomer/Createcustomer';
import Viewcustomer from './Components/Managecustomer/Viewcustomer/Viewcustomer';
import Createexpense from './Components/Manageexpense/Createexpense/Createexpense';
import Viewexpense from './Components/Manageexpense/Viewexpense/Viewexpense';
import Eachlead from './Components/Eachlead/Eachlead';
import Updatelead from './Components/Managelead/Updatelead/Updatelead';
import Eachticket from './Components/Eachticket/Eachticket';
import Updateticket from './Components/Manageticket/Updateticket/Updateticket';
import Verifyexpense from './Components/Manageexpense/Verifyexpense/Verifyexpense';


function App() {
  const sharedvalue = useContext(MyContext);
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={(sharedvalue.uid!=='' && sharedvalue.isAuthed)?<Dashboard/>:<Login/>}/>
        {/* manage lead nav links */}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed &&  <Route path='/managelead/leadcreate' element={<Managelead/>}/>}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && <Route path='/managelead/viewlead' element={<Viewlead/>}/>}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && <Route path='/managelead/viewlead/:leadid' element={<Eachlead/>}/>}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && <Route path='managelead/updatelead/:leadid' element={<Updatelead/>}/>}
        {/* manage ticket navlinks */}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && <Route path='/manageticket/createticket' element={<Createticket/>}/>}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && <Route path='/manageticket/viewticket' element={<Viewticket/>}/>}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && <Route path='/manageticket/viewticket/:tktid' element={<Eachticket/>}/>}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && <Route path='/manageticket/updateticket/:tktid' element={<Updateticket/>}/>}
        {/* manager nav links */}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && sharedvalue.role==='admin' && <Route path='/managemanger/createmanger' element={<Createmanager/>}/>}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && sharedvalue.role==='admin' && <Route path='/managemanger/viewmanger' element={<Viewmanager/>}/>}
        {/* emplpoyee nav links */}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && (sharedvalue.role==='admin' || sharedvalue.role==='manager') && <Route path='/manageemployee/createemployee' element={<Createemployee/>}/>}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && (sharedvalue.role==='admin' || sharedvalue.role==='manager') && <Route path='/manageemployee/viewemployee' element={<Viewemployee/>}/>}
        {/* finance nav links */}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && sharedvalue.role==='admin' && <Route path='/managefinance/createfinance' element={<Createfinance/>}/>}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && sharedvalue.role==='admin' && <Route path='/managefinance/viewfinance' element={<Viewfinance/>}/>}
        {/* customer nav links */}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && (sharedvalue.role==='admin' || sharedvalue.role === 'manager' || sharedvalue.role==='employee') &&<Route path='/managecustomer/createcustomer' element={<Createcustomer/>}/>}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && (sharedvalue.role==='admin' || sharedvalue.role === 'manager' || sharedvalue.role==='employee') &&<Route path='/managecustomer/viewcustomer' element={<Viewcustomer/>}/>}
        {/* expense nav links */}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && (sharedvalue.role==='admin' || sharedvalue.role==='manager' ||sharedvalue.role==='employee') && <Route path='/manageexpense/createexpense' element={<Createexpense/>}/> }
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && (sharedvalue.role==='admin' || sharedvalue.role==='manager' ||sharedvalue.role==='employee') && <Route path='/manageexpense/viewexpense' element={<Viewexpense/>}/> }
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && sharedvalue.role==='admin'  && <Route path='/manageexpense/verifyexpense/:expid' element={<Verifyexpense/>} />}
        <Route path='/*' element={<Error/>}/>
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;
