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
import Editexpense from './Components/Manageexpense/Editexpense/Editexpense';
import Meetingdetails from './Components/Meetingdetails/Meetingdetails';
import Createquotation from './Components/Managequotation/Createquotation/Createquotation';
import Viewquotation from './Components/Managequotation/Viewquotation/Viewquotation';
import Financeverify from './Components/Manageexpense/Financeverify/Financeverify';
import Search from './Components/Searchbar/Search';
import Profile from './Components/Profile/Profile';
import Updatequotation from './Components/Managequotation/Updatequotation/Updatequotation';
import Verifyquotation from './Components/Managequotation/Verifyquotation/Verifyquotation';
import Passwords from './Components/Passwords/Passwords';
import Documents from './Components/Documents/Documents';
import AddDocuments from './Components/Documents/AddDocuments';
//create amc and view aMC
import CreateAmc from './Components/ManageAmc/CreateAmc/CreateAmc';
import ViewAmc from './Components/ManageAmc/ViewAmc/ViewAmc';
import VerifyAmc from './Components/ManageAmc/VerifyAmc/VerifyAmc';
import UpdateSpare from './Components/ManageSpare/UpdateSpare/UpdateSpare';
//create and view  spare
import CreateSpare from './Components/ManageSpare/CreateSpare/CreateSpare';
import ViewSpare from './Components/ManageSpare/ViewSpare/ViewSpare';
import VerifySpare from './Components/ManageSpare/VerifySapre/VerifySpare';
// import Comaasrgb from './Components/Managequotation/Comaasrgb';

//please remove after completed the design
import Spinner from './Components/Spinner/Spinner';
import Sruthitech from './Components/Managequotation/Sruthitech';
 
function App() {
  const sharedvalue = useContext(MyContext);
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={(sharedvalue.uid!=='' && sharedvalue.isAuthed)?<Dashboard/>:<Login/>}/>
        {/* manage lead nav links */}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed &&  (sharedvalue.role==='admin' || sharedvalue.role==='manager' ||
        (sharedvalue.role==='employee' && (Object.prototype.hasOwnProperty.call(sharedvalue.workersdata[sharedvalue.uid], "ecat")?(sharedvalue.workersdata[sharedvalue.uid].ecat==="both"||sharedvalue.workersdata[sharedvalue.uid].ecat==="sales"):true) )
        || sharedvalue.role==='customer') && <Route path='/managelead/leadcreate' element={<Managelead/>}/>}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && (sharedvalue.role==='admin' || sharedvalue.role==='manager' ||
        (sharedvalue.role==='employee' && (Object.prototype.hasOwnProperty.call(sharedvalue.workersdata[sharedvalue.uid], "ecat")?(sharedvalue.workersdata[sharedvalue.uid].ecat==="both"||sharedvalue.workersdata[sharedvalue.uid].ecat==="sales"):true) )
        || sharedvalue.role==='customer') && <Route path='/managelead/viewlead' element={<Viewlead/>}/>}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed &&  (sharedvalue.role==='admin' || sharedvalue.role==='manager' ||
        (sharedvalue.role==='employee' && (Object.prototype.hasOwnProperty.call(sharedvalue.workersdata[sharedvalue.uid], "ecat")?(sharedvalue.workersdata[sharedvalue.uid].ecat==="both"||sharedvalue.workersdata[sharedvalue.uid].ecat==="sales"):true) )
        || sharedvalue.role==='customer') && <Route path='/managelead/viewlead/:leadid' element={<Eachlead/>}/>}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed &&  (sharedvalue.role==='admin' || sharedvalue.role==='manager' ||
        (sharedvalue.role==='employee' && (Object.prototype.hasOwnProperty.call(sharedvalue.workersdata[sharedvalue.uid], "ecat")?(sharedvalue.workersdata[sharedvalue.uid].ecat==="both"||sharedvalue.workersdata[sharedvalue.uid].ecat==="sales"):true) )
        || sharedvalue.role==='customer') && <Route path='managelead/updatelead/:leadid' element={<Updatelead/>}/>}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed &&  (sharedvalue.role==='admin' || sharedvalue.role==='manager' ||
        (sharedvalue.role==='employee' && (Object.prototype.hasOwnProperty.call(sharedvalue.workersdata[sharedvalue.uid], "ecat")?(sharedvalue.workersdata[sharedvalue.uid].ecat==="both"||sharedvalue.workersdata[sharedvalue.uid].ecat==="sales"):true) )
        || sharedvalue.role==='customer') && <Route path='managelead/viewlead/:leadid/meetingdetails' element={<Meetingdetails/>}/>}
        {/* manage ticket navlinks */}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && (sharedvalue.role==='admin' || sharedvalue.role==='manager' ||
        (sharedvalue.role==='employee' && (Object.prototype.hasOwnProperty.call(sharedvalue.workersdata[sharedvalue.uid], "ecat")?(sharedvalue.workersdata[sharedvalue.uid].ecat==="both"||sharedvalue.workersdata[sharedvalue.uid].ecat==="service"):true) )
         || sharedvalue.role==='customer') && <Route path='/manageticket/createticket' element={<Createticket/>}/>}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && (sharedvalue.role==='admin' || sharedvalue.role==='manager' ||
        (sharedvalue.role==='employee' && (Object.prototype.hasOwnProperty.call(sharedvalue.workersdata[sharedvalue.uid], "ecat")?(sharedvalue.workersdata[sharedvalue.uid].ecat==="both"||sharedvalue.workersdata[sharedvalue.uid].ecat==="service"):true) )
         || sharedvalue.role==='customer') && <Route path='/manageticket/viewticket' element={<Viewticket/>}/>}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && (sharedvalue.role==='admin' || sharedvalue.role==='manager' ||
        (sharedvalue.role==='employee' && (Object.prototype.hasOwnProperty.call(sharedvalue.workersdata[sharedvalue.uid], "ecat")?(sharedvalue.workersdata[sharedvalue.uid].ecat==="both"||sharedvalue.workersdata[sharedvalue.uid].ecat==="service"):true) )
         || sharedvalue.role==='customer') && <Route path='/manageticket/viewticket/:tktid' element={<Eachticket/>}/>}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && (sharedvalue.role==='admin' || sharedvalue.role==='manager' ||
        (sharedvalue.role==='employee' && (Object.prototype.hasOwnProperty.call(sharedvalue.workersdata[sharedvalue.uid], "ecat")?(sharedvalue.workersdata[sharedvalue.uid].ecat==="both"||sharedvalue.workersdata[sharedvalue.uid].ecat==="service"):true) )
         || sharedvalue.role==='customer') && <Route path='/manageticket/updateticket/:tktid' element={<Updateticket/>}/>}
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
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && (sharedvalue.role==='admin' || sharedvalue.role==='manager' ||sharedvalue.role==='employee' ||sharedvalue.role==='finance') && <Route path='/manageexpense/createexpense' element={<Createexpense/>}/> }
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && (sharedvalue.role==='admin' || sharedvalue.role==='manager' ||sharedvalue.role==='employee' ||sharedvalue.role==='finance') && <Route path='/manageexpense/viewexpense' element={<Viewexpense/>}/> }
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && sharedvalue.role==='admin'  && <Route path='/manageexpense/verifyexpense/:expid' element={<Verifyexpense/>} />}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && sharedvalue.role==='finance' && <Route path='/manageexpense/financeverify/:expid' element={<Financeverify/>}/>}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && (sharedvalue.role==='admin' || sharedvalue.role==='manager' ||sharedvalue.role==='employee' ||sharedvalue.role==='finance') && <Route path='/manageexpense/editexpense/:expid' element={<Editexpense/>}/> }
        {/* manage quotation nav links*/}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && (sharedvalue.role==='admin' || sharedvalue.role==='manager' ||sharedvalue.role==='employee') &&  <Route path='/managequotation/createquotation' element={<Createquotation/>}/>}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && (sharedvalue.role==='admin' || sharedvalue.role==='manager' ||sharedvalue.role==='employee') &&  <Route path='/managequotation/viewquotation' element={<Viewquotation/>}/>}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && (sharedvalue.role==='admin' || sharedvalue.role==='manager' ||sharedvalue.role==='employee') &&  <Route path='/managequotation/updatequotation/:quoteid' element={<Updatequotation/>}/>}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && (sharedvalue.role==='admin' || sharedvalue.role==='manager' ||sharedvalue.role==='employee') &&  <Route path='/managequotation/verifyquotation/:quoteid' element={<Verifyquotation/>}/>}
        {/* {sharedvalue.uid!=='' && sharedvalue.isAuthed && (sharedvalue.role==='admin' || sharedvalue.role==='manager' ||sharedvalue.role==='employee') &&  <Route path='/managequotation/pdfview/:quoteid' element={<Comaasrgb/>}/>} */}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && (sharedvalue.role==='admin' || sharedvalue.role==='manager' ||sharedvalue.role==='employee') &&  <Route path='/managequotation/sruthipdf/:quoteid' element={<Sruthitech/>}/>}
        {/* search bar nav link */}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && sharedvalue.role==='admin'   && <Route path='/search' element={<Search/>} />}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && sharedvalue.role==='admin' && <Route path='/passwords' element={<Passwords/>}/>}
        {/* profile nav link */}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && <Route path='/profile' element={<Profile/>}/>}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && <Route path='/documents/:category/:subcategory' element={<Documents/>}/>}
        {sharedvalue.uid!=='' && sharedvalue.isAuthed && sharedvalue.role==='admin' && <Route path='/adddocuments' element={<AddDocuments/>}/>}
        {/* managing amc */}
        <Route path='/manageamc/createamc' element={<CreateAmc/>}/>
        <Route path='/manageamc/viewamc' element={<ViewAmc/>}/>
        <Route path='/manageamc/verifyamc/:amcid' element={<VerifyAmc/>}/>

        {/* manage spare quotation */}
        <Route path='/managespare/createspare' element={<CreateSpare/>}/>
        <Route path='/managespare/viewspare' element={<ViewSpare/>}/>
        <Route path='/managespare/verifyspare/:spareid' element={<VerifySpare/>}/>
        <Route path='/manageamc/updatespare/:spareid' element={<UpdateSpare/>}/>


        <Route path='/spinner' element={<Spinner/>}/>
        <Route path='/*' element={<Error/>}/>

      </Routes>
      
    </BrowserRouter>
  );
}

export default App;
