import React, { useContext, useState } from 'react';
import './Eachlead.css';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from '../Sidenav/Sidenav';
import MyContext from '../../MyContext';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Error from '../../Error/Error';

function Eachlead(){
    const sharedvalue = useContext(MyContext);
    const navigate = useNavigate();
    //show details starts here
    const [showdetails,setshowdetails] = useState(false);
    const [showmodificationdetail,setmodificationdetail] = useState(false);
    //show details ends here
    const {leadid} = useParams();
    //code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }
    // toggle menu bar code ends here
    
    return(
        <>
            {(sharedvalue.leadskeys.length>0 && sharedvalue.leadskeys.includes(leadid))===true?
            <div className='manlead-con'>
                <Sidenav menutoggle={menutoggle} handlemenutoggle={handlemenutoggle}/>
                <div className='manage-con-inner'>

                    {/* inner navbar container */}
                    <div className='top-bar'>
                        <div className='top-nav-tog'>
                            <MenuIcon  onClick={()=>setmenutoggle(prev=>!prev)}/>
                        </div>
                        <div className='search-icon-top-nav'>
                            <SearchIcon />
                        </div>
                        <PersonIcon/>
                        <p>{sharedvalue.userdtl.email}</p>
                    </div>
                    {/* your createcustomer starts from here */}
                    <div className='create-lead-con'>
                        {/* <div className="create-header-starts-here">
                            <div className="new-ticket-header">
                                <h1>{sharedvalue.leadsdata[leadid].contperson}-[{leadid}]</h1>
                            </div>
                        </div> */}
                        <div className='each-lead-head-comes-here'>
                            <h1>{sharedvalue.leadsdata[leadid].contperson} - [{leadid}]</h1>
                        </div>
                        {/* header end */}
                        <div className='top-eachlead-buttons'>
                            <div>
                                <p><span className='each-lead-head-comes-here-span-1'>Status :</span>  {sharedvalue.leadsdata[leadid].custstatus}</p>
                            </div>
                            <div className='top-eachlead-buttons-inner'>
                                <button onClick={()=>navigate(`/managelead/updatelead/${leadid}`)}>edit</button>
                                <button onClick={()=>navigate(`/managelead/viewlead/${leadid}/meetingdetails`)}>Next Meeting</button>
                            </div>
                        </div>
                        {/* customer inquiry starts here */}
                        <div className='create-lead-requirements'>
                            <div className='create-lead-requirements-head'>
                                <h1>CUSTOMER INQUIRY FORM</h1>
                            </div>
                            <div className='create-lead-requirements-all-fields'>
                                {
                                    showdetails && 
                                    <div>
                                        <label>Customer Type</label>
                                        <input type='text' value={sharedvalue.leadsdata[leadid].custtype} readOnly/>
                                    </div>
                                }
                                {
                                    showdetails &&
                                    <div>
                                        <label>Customer Status</label>
                                        <input type='text' value={sharedvalue.leadsdata[leadid].custstatus} readOnly/>
                                    </div>
                                }
                                {
                                    showdetails &&
                                    <div>
                                        <label>Start Date</label>
                                        <input type='text' value={sharedvalue.leadsdata[leadid].custstartdate} readOnly/>
                                    </div>
                                }
                                {
                                    showdetails &&
                                    <div>
                                        <label>End Date</label>
                                        <input type='text' value={sharedvalue.leadsdata[leadid].custenddate} readOnly/>
                                    </div>
                                }
                                {
                                    showdetails &&
                                    <div>
                                        <label>Revert Date</label>
                                        <input type='text' value={sharedvalue.leadsdata[leadid].custnextdate} readOnly/>
                                    </div>
                                }
                                {
                                    showdetails &&
                                    <div>
                                        <label>Source of Enquiry</label>
                                        <input type='text' value={sharedvalue.leadsdata[leadid].custsourceofenquiry} readOnly/>
                                    </div>
                                }
                                
                                    <div>
                                        <label>Company Name</label>
                                        <input type='text' value={sharedvalue.leadsdata[leadid].custcompanyname} readOnly/>
                                    </div>
                            </div>
                        </div>
                        {/* customer inquiry ends here */}
                        {/* view manqager and employee starts here*/}
                        <div className='create-lead-requirements'>
                            <div className='create-lead-requirements-head'>
                                <h1>manager and employee</h1>
                            </div>
                            <div className='create-lead-requirements-all-fields'>
                                <div>
                                    <label>Manager</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].managerid!==''?sharedvalue.workersdata[sharedvalue.leadsdata[leadid].managerid].name:'-'} readOnly/>
                                </div>
                                <div>
                                    <label>Employee</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].employeeid!==''?sharedvalue.workersdata[sharedvalue.leadsdata[leadid].employeeid].name:'-'} readOnly/>
                                </div>
                            </div>
                        </div>
                        {/* view manager and employee ends here */}
                        {/* status and edit buttons div ends here */}
                        <div className='create-lead-requirements'>
                            <div className='create-lead-requirements-head'>
                                <h1>CONTACT DETAILS</h1>
                            </div>
                            <div className='create-lead-requirements-all-fields'>
                                <div>
                                    <label>Contact Person</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].contperson} readOnly/>
                                </div>
                                <div>
                                    <label>Designation</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].contdesignation} readOnly/>
                                </div>
                                <div>
                                    <label>Contact Person Number</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].contcountrycode+sharedvalue.leadsdata[leadid].contmobilenum} readOnly/>
                                </div>
                                <div>
                                    <label>Contact Person Email</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].contpersonemail} readOnly/>
                                </div>
                            </div>
                        </div>
                        {/* lead contact details end's here */}
                        {
                        showdetails &&
                        <div className='create-lead-requirements'>
                            <div className='create-lead-requirements-head'>
                                <h1>OFFICE DETAILS</h1>
                            </div>
                            <div className='create-lead-requirements-all-fields'>
                                <div>
                                    <label>Country</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].ofdcountry} readOnly/>
                                </div>
                                <div>
                                    <label>State</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].ofdst} readOnly/>
                                </div>
                                <div>
                                    <label>District</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].ofddst} readOnly/>
                                </div>
                                <div>
                                    <label>City</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].ofdcty} readOnly/>
                                </div>
                                <div>
                                    <label>Pincode</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].ofdpinc} readOnly/>
                                </div>
                                <div>
                                    <label>GSTIN</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].contdesignation} readOnly/>
                                </div>
                                <div>
                                    <label>IE code</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].ofdiec} readOnly/>
                                </div>
                                <div>
                                    <label>Office Details</label>
                                    <textarea  value={sharedvalue.leadsdata[leadid].ofd} readOnly/>
                                </div>
                            </div>
                        </div>
                        }
                        {/* office details ends herfe */}
                        <div className='create-lead-requirements'>
                            <div className='create-lead-requirements-head'>
                                <h1>REQUIREMENTS</h1>
                            </div>
                            <div className='create-lead-requirements-all-fields'>
                                <div>
                                    <label>Requirements</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].businesstype} readOnly/>
                                </div>
                                <div>
                                    <label>Mill Capacity</label>
                                    <input type='number' value={sharedvalue.leadsdata[leadid].millcap} readOnly/>
                                </div>
                                <div>
                                    <label>Chute</label>
                                    <input type='number' value={sharedvalue.leadsdata[leadid].chutes} readOnly/>
                                </div>
                                {
                                    showdetails &&
                                <div>
                                    <label>Capacity Required (per Hour)</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].capreq} readOnly/>
                                </div>
                                }
                                {
                                    showdetails &&
                                <div>
                                    <label>Machine Required</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].machinereq} readOnly/>
                                </div>
                                }
                                {
                                    showdetails &&
                                <div>
                                    <label>Make</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].make} readOnly/>
                                </div>
                                }
                                {
                                    showdetails &&
                                <div>
                                    <label>Machine Type</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].machinetype} readOnly/>
                                </div>
                                }
                                <div>
                                    <label>Type</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].std} readOnly/>
                                </div>
                                <div>
                                    <label>Payment</label>
                                    <input type='text' value={sharedvalue.leadsdata[leadid].payment} readOnly/>
                                </div>
                                <div>
                                    <label>Assigned Email</label>
                                    <input type='email' readOnly/>
                                </div>
                            </div>
                            <textarea className='eachlead-requirements-textarea' value={sharedvalue.leadsdata[leadid].reqdes} readOnly/>
                        </div>
                        {/* inquiry form ends here */}
                        <div className='each-lead-show-details-modification-div'>
                            <div>
                                <input type="checkbox" checked={showdetails} onChange={()=>setshowdetails(prev=>!prev)}/>
                                <p>Show Details</p>
                            </div>
                            <div>
                                <input type="checkbox" checked={showmodificationdetail} onChange={()=>setmodificationdetail(prev=>!prev)} />
                                <p>Show Modification Details</p>
                            </div>
                        </div>
                        {/* your sjow modification details will ends  here */}
                        {/* sshow modification details table starts from here */}
                        <div className='eachlead-show-modification-details'>
                            
                        {
                            showmodificationdetail &&
                            <div className="view-list-table-con">
                                <div className='create-lead-requirements-head'>
                                    <h1>Modification Details</h1>
                                </div>
                                <table>
                                    <thead>
                                        <tr className="table-head-row">
                                            <th>si.no</th>
                                            <th>date</th>
                                            <th>time</th>
                                            <th>modified by</th>
                                            <th>action performed</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            sharedvalue.leadsdata[leadid].modifiedby.map((modi,idx)=>(
                                                <tr key={idx} className="each-table-row-view" >
                                                     <td >
                                                        <p className="view-manager-list-name">
                                                            {idx+1}
                                                        </p>
                                                    </td>
                                                    {/* customer */}
                                                    <td >
                                                        <p className="view-manager-list-name">
                                                            {modi.date}
                                                        </p>
                                                    </td>
                                                    {/* country */}
                                                    <td >
                                                        <p className="view-manager-list-name">
                                                            {modi.time}
                                                        </p>
                                                    </td>
                                                    {/* state */}
                                                    <td >
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.workersdata[modi.uid].name}
                                                        </p>
                                                    </td>
                                                    {/* district */}
                                                    <td >
                                                        <p className="view-manager-list-name">
                                                            updation
                                                        </p>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        }
                        </div>
                        {/* show modification details table ends here */}
                    </div>
                    {/* create customer ends here */}
                </div>
            </div>:<Error/>
            }
        </>
    );
}

export default Eachlead;